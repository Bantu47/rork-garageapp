import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ServiceRecord } from '@/types/vehicle';
import { formatDate } from '@/utils/imageGenerator';
import colors from '@/constants/colors';
import { Wrench, DollarSign } from 'lucide-react-native';

interface ServiceRecordItemProps {
  record: ServiceRecord;
}

export default function ServiceRecordItem({ record }: ServiceRecordItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Wrench size={16} color={colors.primary} />
          <Text style={styles.type}>{record.type}</Text>
        </View>
        <Text style={styles.date}>{formatDate(record.date)}</Text>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.mileage}>{record.mileage.toLocaleString()} km</Text>
        
        <View style={styles.costContainer}>
          <DollarSign size={14} color={colors.textLight} />
          <Text style={styles.cost}>${record.cost.toFixed(2)}</Text>
        </View>
      </View>
      
      {record.notes && (
        <Text style={styles.notes}>{record.notes}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  date: {
    fontSize: 14,
    color: colors.textLight,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mileage: {
    fontSize: 14,
    color: colors.text,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cost: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  notes: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
});