import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  current: number;
  target: number;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  height = 12,
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <View style={styles.container}>
      <View style={[styles.background, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              height,
              backgroundColor: percentage >= 100 ? '#10B981' : '#3B82F6',
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  background: {
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 6,
  },
});
