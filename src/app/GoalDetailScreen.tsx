import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGoalsStore } from '../state';
import { ProgressBar, LoadingIndicator } from '../components';
import {
  formatCurrency,
  formatDate,
  getDaysUntilDeadline,
  calculateCurrentBalance,
} from '../domain';
import { RootStackParamList } from '../navigation';
import { analyticsService } from '../infrastructure/analytics';

export const GoalDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'GoalDetail'>>();
  const { goalId } = route.params;
  
  const { getGoalWithProgress, addDeposit, isLoading } = useGoalsStore();
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDate, setDepositDate] = useState(new Date().toISOString().split('T')[0]);
  
  const goalWithProgress = getGoalWithProgress(goalId);

  useEffect(() => {
    analyticsService.track('goal_detail_viewed', {
      goal_id: goalId,
    });
  }, [goalId]);

  if (!goalWithProgress) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Meta não encontrada</Text>
      </View>
    );
  }

  const daysLeft = getDaysUntilDeadline(goalWithProgress.deadline);

  const handleAddDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    try {
      await addDeposit(goalId, amount, depositDate);
      setDepositAmount('');
      Alert.alert('Sucesso', 'Aporte adicionado com sucesso!');
    } catch {
      Alert.alert('Erro', 'Falha ao adicionar aporte');
    }
  };

  const sortedDeposits = [...goalWithProgress.deposits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{goalWithProgress.name}</Text>
        <Text style={styles.category}>{goalWithProgress.category}</Text>
        
        <ProgressBar
          current={goalWithProgress.currentBalance}
          target={goalWithProgress.targetValue}
          height={16}
        />
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Acumulado</Text>
            <Text style={styles.statValue}>
              {formatCurrency(goalWithProgress.currentBalance)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Meta</Text>
            <Text style={styles.statValue}>
              {formatCurrency(goalWithProgress.targetValue)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Progresso</Text>
            <Text style={[styles.statValue, styles.highlight]}>
              {goalWithProgress.progressPercentage.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Detalhes</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data Limite</Text>
          <Text style={[styles.detailValue, daysLeft < 0 && styles.overdue]}>
            {formatDate(goalWithProgress.deadline)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={styles.detailValue}>
            {daysLeft < 0
              ? 'Vencida'
              : goalWithProgress.progressPercentage >= 100
              ? 'Concluída'
              : 'Em andamento'}
          </Text>
        </View>
        
        {goalWithProgress.projectedCompletionDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Projeção</Text>
            <Text style={styles.detailValue}>
              Se mantiver o ritmo atual, você atingirá a meta em{' '}
              {formatDate(goalWithProgress.projectedCompletionDate)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Adicionar Aporte</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Valor do aporte"
          keyboardType="numeric"
          value={depositAmount}
          onChangeText={setDepositAmount}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Data (YYYY-MM-DD)"
          value={depositDate}
          onChangeText={setDepositDate}
        />
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleAddDeposit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Adicionando...' : 'Adicionar Aporte'}
          </Text>
        </TouchableOpacity>
      </View>

      {sortedDeposits.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Histórico de Aportes</Text>
          
          {sortedDeposits.map((deposit) => (
            <View key={deposit.id} style={styles.depositItem}>
              <View>
                <Text style={styles.depositAmount}>
                  {formatCurrency(deposit.amount)}
                </Text>
                <Text style={styles.depositDate}>{formatDate(deposit.date)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  highlight: {
    color: '#3B82F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  overdue: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  depositItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  depositAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  depositDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  error: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 32,
  },
});
