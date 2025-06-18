import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle, ServiceRecord, Reminder } from '@/types/vehicle';
import { generateVehicleImage } from '@/utils/imageGenerator';
import { usePaymentStore } from '@/store/paymentStore';

interface VehicleState {
  vehicles: Vehicle[];
  serviceRecords: ServiceRecord[];
  reminders: Reminder[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'imageUrl'> & { customImage?: string | null }) => Promise<Vehicle | null>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addServiceRecord: (record: Omit<ServiceRecord, 'id'>) => void;
  updateServiceRecord: (id: string, record: Partial<ServiceRecord>) => void;
  deleteServiceRecord: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  getServiceRecordsByVehicleId: (vehicleId: string) => ServiceRecord[];
  getRemindersByVehicleId: (vehicleId: string) => Reminder[];
  getUpcomingReminders: () => Reminder[];
  updateVehicleImage: (id: string, imageUri: string) => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      serviceRecords: [],
      reminders: [],

      addVehicle: async (vehicleData) => {
        // Check if user can add a vehicle
        const paymentStore = usePaymentStore.getState();
        const canAddVehicle = paymentStore.canAddVehicle();
        
        if (!canAddVehicle) {
          // User has reached the limit and needs to subscribe
          return null;
        }
        
        const id = Date.now().toString();
        
        // Use custom image if provided, otherwise generate placeholder
        const imageUrl = vehicleData.customImage || 
          await generateVehicleImage(vehicleData.make, vehicleData.model, vehicleData.color);
        
        // Remove customImage from vehicleData before creating the vehicle object
        const { customImage, ...vehicleDataWithoutImage } = vehicleData;
        
        const vehicle: Vehicle = {
          ...vehicleDataWithoutImage,
          id,
          imageUrl
        };

        set((state) => ({
          vehicles: [...state.vehicles, vehicle]
        }));

        // Create license reminder
        const licenseReminder: Omit<Reminder, 'id'> = {
          vehicleId: id,
          type: 'license',
          dueDate: vehicleData.licenseExpiry,
          title: 'License Renewal',
          description: `Renew license for ${vehicleData.make} ${vehicleData.model} (${vehicleData.licensePlate})`,
          isCompleted: false
        };

        // Create service reminder
        const serviceReminder: Omit<Reminder, 'id'> = {
          vehicleId: id,
          type: 'service',
          dueDate: vehicleData.nextService,
          title: 'Vehicle Service',
          description: `Service due for ${vehicleData.make} ${vehicleData.model} (${vehicleData.licensePlate})`,
          isCompleted: false
        };

        get().addReminder(licenseReminder);
        get().addReminder(serviceReminder);

        return vehicle;
      },

      updateVehicle: (id, updatedVehicle) => {
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) => 
            vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
          )
        }));

        // Update related reminders if dates changed
        if (updatedVehicle.licenseExpiry || updatedVehicle.nextService) {
          const vehicle = get().getVehicleById(id);
          if (!vehicle) return;

          set((state) => ({
            reminders: state.reminders.map((reminder) => {
              if (reminder.vehicleId !== id) return reminder;
              
              if (reminder.type === 'license' && updatedVehicle.licenseExpiry) {
                return {
                  ...reminder,
                  dueDate: updatedVehicle.licenseExpiry,
                  description: `Renew license for ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`
                };
              }
              
              if (reminder.type === 'service' && updatedVehicle.nextService) {
                return {
                  ...reminder,
                  dueDate: updatedVehicle.nextService,
                  description: `Service due for ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`
                };
              }
              
              return reminder;
            })
          }));
        }
      },

      updateVehicleImage: (id, imageUri) => {
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) => 
            vehicle.id === id ? { ...vehicle, imageUrl: imageUri } : vehicle
          )
        }));
      },

      deleteVehicle: (id) => {
        set((state) => ({
          vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
          serviceRecords: state.serviceRecords.filter((record) => record.vehicleId !== id),
          reminders: state.reminders.filter((reminder) => reminder.vehicleId !== id)
        }));
      },

      addServiceRecord: (recordData) => {
        const id = Date.now().toString();
        const record: ServiceRecord = { ...recordData, id };

        set((state) => ({
          serviceRecords: [...state.serviceRecords, record]
        }));

        // Update vehicle's last service date and create next service reminder
        const vehicle = get().getVehicleById(recordData.vehicleId);
        if (vehicle) {
          const serviceDate = new Date(recordData.date);
          const nextServiceDate = new Date(serviceDate);
          nextServiceDate.setMonth(nextServiceDate.getMonth() + 6); // Assuming 6-month service interval
          
          get().updateVehicle(vehicle.id, {
            lastService: recordData.date,
            nextService: nextServiceDate.toISOString()
          });

          // Create or update service reminder
          const existingReminders = get().getRemindersByVehicleId(vehicle.id)
            .filter(r => r.type === 'service' && !r.isCompleted);
          
          if (existingReminders.length > 0) {
            get().updateReminder(existingReminders[0].id, {
              dueDate: nextServiceDate.toISOString(),
              isCompleted: false
            });
          } else {
            get().addReminder({
              vehicleId: vehicle.id,
              type: 'service',
              dueDate: nextServiceDate.toISOString(),
              title: 'Vehicle Service',
              description: `Service due for ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
              isCompleted: false
            });
          }
        }
      },

      updateServiceRecord: (id, updatedRecord) => {
        set((state) => ({
          serviceRecords: state.serviceRecords.map((record) => 
            record.id === id ? { ...record, ...updatedRecord } : record
          )
        }));
      },

      deleteServiceRecord: (id) => {
        set((state) => ({
          serviceRecords: state.serviceRecords.filter((record) => record.id !== id)
        }));
      },

      addReminder: (reminderData) => {
        const id = Date.now().toString();
        const reminder: Reminder = { ...reminderData, id };

        set((state) => ({
          reminders: [...state.reminders, reminder]
        }));
      },

      updateReminder: (id, updatedReminder) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) => 
            reminder.id === id ? { ...reminder, ...updatedReminder } : reminder
          )
        }));
      },

      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id)
        }));
      },

      completeReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) => 
            reminder.id === id ? { ...reminder, isCompleted: true } : reminder
          )
        }));
      },

      getVehicleById: (id) => {
        return get().vehicles.find((vehicle) => vehicle.id === id);
      },

      getServiceRecordsByVehicleId: (vehicleId) => {
        return get().serviceRecords
          .filter((record) => record.vehicleId === vehicleId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getRemindersByVehicleId: (vehicleId) => {
        return get().reminders
          .filter((reminder) => reminder.vehicleId === vehicleId)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      },

      getUpcomingReminders: () => {
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        return get().reminders
          .filter((reminder) => {
            const dueDate = new Date(reminder.dueDate);
            return !reminder.isCompleted && dueDate <= thirtyDaysFromNow;
          })
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      }
    }),
    {
      name: 'vehicle-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);