import { create } from 'zustand';
import { Goal, GoalWithProgress, GoalCategory } from '../domain/models';
import { calculateGoalWithProgress } from '../domain';
import { goalRepository } from '../data';
import { analyticsService } from '../infrastructure/analytics';
import { featureFlagsService } from '../infrastructure/feature-flags';

interface GoalsState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  milestoneGoalId: string | null;
  
  fetchGoals: () => Promise<void>;
  createGoal: (data: {
    name: string;
    targetValue: number;
    deadline: string;
    category: GoalCategory;
  }) => Promise<Goal>;
  deleteGoal: (id: string) => Promise<void>;
  addDeposit: (goalId: string, amount: number, date: string) => Promise<void>;
  getGoalWithProgress: (id: string) => GoalWithProgress | null;
  getAllGoalsWithProgress: () => GoalWithProgress[];
  clearMilestone: () => void;
  clearError: () => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,
  milestoneGoalId: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await goalRepository.getAll();
      set({ goals, isLoading: false });
    } catch (error) {
      set({ error: 'Falha ao carregar metas', isLoading: false });
    }
  },

  createGoal: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newGoal = await goalRepository.create(data);
      analyticsService.track('goal_created', {
        goal_id: newGoal.id,
        goal_name: newGoal.name,
        target_value: newGoal.targetValue,
        category: newGoal.category,
      });
      set((state) => ({
        goals: [...state.goals, newGoal],
        isLoading: false,
      }));
      return newGoal;
    } catch (error) {
      set({ error: 'Falha ao criar meta', isLoading: false });
      throw error;
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await goalRepository.delete(id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Falha ao excluir meta', isLoading: false });
    }
  },

  addDeposit: async (goalId, amount, date) => {
    set({ isLoading: true, error: null });
    try {
      await goalRepository.addDeposit(goalId, amount, date);
      const updatedGoals = await goalRepository.getAll();
      const goal = updatedGoals.find((g) => g.id === goalId);
      
      if (goal) {
        analyticsService.track('deposit_added', {
          goal_id: goalId,
          amount,
          total_deposits: goal.deposits.length,
        });

        const previousGoals = get().goals;
        const previousGoal = previousGoals.find((g) => g.id === goalId);
        const previousBalance = previousGoal?.deposits.reduce((s, d) => s + d.amount, 0) || 0;
        const previousPercentage = previousGoal ? (previousBalance / goal.targetValue) * 100 : 0;
        const currentPercentage = (goal.deposits.reduce((s, d) => s + d.amount, 0) / goal.targetValue) * 100;

        if (
          featureFlagsService.isEnabled('show_milestone_celebration') &&
          currentPercentage >= 50 &&
          previousPercentage < 50
        ) {
          analyticsService.track('milestone_reached', {
            goal_id: goalId,
            milestone: 50,
            current_percentage: currentPercentage,
          });
          set({ milestoneGoalId: goalId });
        }
      }

      set({ goals: updatedGoals, isLoading: false });
    } catch (error) {
      set({ error: 'Falha ao adicionar aporte', isLoading: false });
    }
  },

  getGoalWithProgress: (id) => {
    const goal = get().goals.find((g) => g.id === id);
    return goal ? calculateGoalWithProgress(goal) : null;
  },

  getAllGoalsWithProgress: () => {
    return get().goals.map((goal) => calculateGoalWithProgress(goal));
  },

  clearMilestone: () => {
    set({ milestoneGoalId: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
