import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MilestoneCelebrationProps {
  percentage: number;
  onClose: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  percentage,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Parabéns!</Text>
      <Text style={styles.description}>
        Você atingiu {percentage.toFixed(0)}% da sua meta!
      </Text>
      <Text style={styles.message}>
        Continue assim, você está no caminho certo para alcançar seu objetivo.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B45309',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#78350F',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
