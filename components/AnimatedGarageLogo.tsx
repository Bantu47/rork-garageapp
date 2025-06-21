import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '@/constants/colors';

interface AnimatedGarageLogoProps {
  size?: number;
  color?: string;
  showText?: boolean;
  textSize?: number;
}

export default function AnimatedGarageLogo({ 
  size = 150, 
  color = 'white',
  showText = true,
  textSize = 42
}: AnimatedGarageLogoProps) {
  return (
    <View style={[styles.container, { width: size * 2 }]}>
      <Text style={[styles.logoText, { fontSize: textSize * 1.2, color: color }]}>
        G A R A G E
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: 'bold',
  }
});