import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { GoalListScreen, GoalDetailScreen, CreateGoalScreen } from '../app';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GoalList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3B82F6',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="GoalList"
          component={GoalListScreen}
          options={{ title: 'Minhas Metas' }}
        />
        <Stack.Screen
          name="GoalDetail"
          component={GoalDetailScreen}
          options={{ title: 'Detalhes da Meta' }}
        />
        <Stack.Screen
          name="CreateGoal"
          component={CreateGoalScreen}
          options={{ title: 'Nova Meta' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
