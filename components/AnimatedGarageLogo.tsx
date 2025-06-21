import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
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
  showText = false,
  textSize = 24
}: AnimatedGarageLogoProps) {
  const iconSize = size * 0.6;
  
  return (
    <View style={[styles.container, { width: size }]}>
      <View style={styles.logoContainer}>
        {/* Garage Icon */}
        <Svg width={iconSize} height={iconSize * 0.8} viewBox="0 0 100 80">
          {/* House/Garage Shape */}
          <Path
            d="M50,0 L100,40 L100,80 L0,80 L0,40 Z"
            fill={color}
            stroke="none"
          />
          {/* Garage Door */}
          <Rect
            x="25"
            y="40"
            width="50"
            height="40"
            fill={color}
            stroke="#000"
            strokeWidth="2"
          />
          {/* Garage Door Lines */}
          <Rect x="25" y="48" width="50" height="0.5" fill="#000" />
          <Rect x="25" y="56" width="50" height="0.5" fill="#000" />
          <Rect x="25" y="64" width="50" height="0.5" fill="#000" />
          <Rect x="25" y="72" width="50" height="0.5" fill="#000" />
        </Svg>
        
        {/* Logo Text */}
        {showText && (
          <Text 
            style={[
              styles.logoText, 
              { 
                fontSize: textSize, 
                color: color,
                marginLeft: 10
              }
            ]}
            numberOfLines={1}
          >
            GARAGE
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    overflow: 'visible',
  }
});