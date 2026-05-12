import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../../domain/models';

const GOALS_STORAGE_KEY = '@fintrack:goals';

export async function getGoals(): Promise<Goal[]> {
  try {
    const data = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading goals from storage:', error);
    return [];
  }
}

export async function saveGoals(goals: Goal[]): Promise<void> {
  try {
    await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals to storage:', error);
    throw error;
  }
}

export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GOALS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}
