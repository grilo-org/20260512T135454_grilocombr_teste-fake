import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGoalsStore } from '../state';
import { GoalCategory } from '../domain';
import { RootStackParamList } from '../navigation';

const CATEGORIES: { label: string; value: GoalCategory }[] = [
  { label: 'Emergência', value: 'emergencia' },
  { label: 'Viagem', value: 'viagem' },
  { label: 'Investimento', value: 'investimento' },
  { label: 'Outros', value: 'outros' },
];

export const CreateGoalScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { createGoal, isLoading } = useGoalsStore();
  
  const [name, setName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState<GoalCategory>('outros');

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite um nome para a meta');
      return;
    }

    const target = parseFloat(targetValue);
    if (isNaN(target) || target <= 0) {
      Alert.alert('Erro', 'Digite um valor-alvo válido');
      return;
    }

    if (!deadline) {
      Alert.alert('Erro', 'Selecione uma data limite');
      return;
    }

    try {
      await createGoal({
        name: name.trim(),
        targetValue: target,
        deadline,
        category,
      });
      Alert.alert('Sucesso', 'Meta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Erro', 'Falha ao criar meta');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Nova Meta Financeira</Text>
        
        <Text style={styles.label}>Nome da Meta</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Reserva de emergência"
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Valor-Alvo (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="10000"
          keyboardType="numeric"
          value={targetValue}
          onChangeText={setTargetValue}
        />
        
        <Text style={styles.label}>Data Limite (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-12-31"
          value={deadline}
          onChangeText={setDeadline}
        />
        
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryButton,
                category === cat.value && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat.value && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Criando...' : 'Criar Meta'}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    color: '#4B5563',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 16,
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
});
