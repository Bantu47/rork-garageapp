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
    <View style={[styles.container, { width: size }]}>
      <Text style={[styles.logoText, { fontSize: textSize, color: color }]}>
        GARAGE
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
    letterSpacing: 1,
    textAlign: 'center',
    flexWrap: 'nowrap',
    flexShrink: 0,
  }
});