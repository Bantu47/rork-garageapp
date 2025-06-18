import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { Plus } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionRoute?: string;
}

export default function EmptyState({ 
  title, 
  message, 
  actionLabel = 'Add Vehicle', 
  actionRoute = '/add-vehicle' 
}: EmptyStateProps) {
  const router = useRouter();

  const handleAction = () => {
    if (actionRoute) {
      router.push(actionRoute);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {actionRoute && (
        <TouchableOpacity 
          style={styles.button}
          onPress={handleAction}
        >
          <Plus size={20} color="white" />
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});