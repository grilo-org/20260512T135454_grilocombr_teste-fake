import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGoalsStore } from '../state';
import { EmptyState, LoadingIndicator, ProgressBar, MilestoneCelebration } from '../components';
import { GoalWithProgress, formatCurrency, formatDate, getDaysUntilDeadline } from '../domain';
import { RootStackParamList } from '../navigation';

export const GoalListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    fetchGoals,
    getAllGoalsWithProgress,
    isLoading,
    error,
    milestoneGoalId,
    clearMilestone,
    deleteGoal,
  } = useGoalsStore();

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', error);
    }
  }, [error]);

  const goals = getAllGoalsWithProgress();

  const handleDeleteGoal = useCallback((goal: GoalWithProgress) => {
    Alert.alert(
      'Excluir Meta',
      `Tem certeza que deseja excluir a meta "${goal.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteGoal(goal.id),
        },
      ]
    );
  }, [deleteGoal]);

  const renderGoal = ({ item }: { item: GoalWithProgress }) => {
    const daysLeft = getDaysUntilDeadline(item.deadline);
    
    return (
      <TouchableOpacity
        style={styles.goalCard}
        onPress={() => navigation.navigate('GoalDetail', { goalId: item.id })}
        onLongPress={() => handleDeleteGoal(item)}
      >
        <View style={styles.goalHeader}>
          <Text style={styles.goalName}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        
        <ProgressBar current={item.currentBalance} target={item.targetValue} />
        
        <View style={styles.goalInfo}>
          <Text style={styles.amount}>
            {formatCurrency(item.currentBalance)} / {formatCurrency(item.targetValue)}
          </Text>
          <Text style={styles.percentage}>{item.progressPercentage.toFixed(1)}%</Text>
        </View>
        
        <View style={styles.goalFooter}>
          <Text style={[styles.deadline, daysLeft < 0 && styles.overdue]}>
            {daysLeft < 0
              ? `Vencida há ${Math.abs(daysLeft)} dias`
              : `${daysLeft} dias restantes`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && goals.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {milestoneGoalId && (
        <MilestoneCelebration
          percentage={50}
          onClose={clearMilestone}
        />
      )}
      
      {goals.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={renderGoal}
          contentContainerStyle={styles.list}
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateGoal')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  list: {
    padding: 16,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  category: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: 'capitalize',
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amount: {
    fontSize: 14,
    color: '#4B5563',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  goalFooter: {
    marginTop: 8,
  },
  deadline: {
    fontSize: 12,
    color: '#6B7280',
  },
  overdue: {
    color: '#EF4444',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
