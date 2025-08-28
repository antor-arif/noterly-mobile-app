import { useThemeColor } from '@/hooks/useThemeColor';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
}

export function FloatingActionButton({ 
  onPress, 
  icon = 'plus' 
}: FloatingActionButtonProps) {
  const tintColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: tintColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Feather name={icon} size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
