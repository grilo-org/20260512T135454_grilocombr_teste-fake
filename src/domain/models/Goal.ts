export type GoalCategory = 'emergencia' | 'viagem' | 'investimento' | 'outros';

export interface Goal {
  id: string;
  name: string;
  targetValue: number;
  deadline: string;
  category: GoalCategory;
  createdAt: string;
  deposits: Deposit[];
}

export interface Deposit {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface GoalWithProgress extends Goal {
  currentBalance: number;
  progressPercentage: number;
  projectedCompletionDate: string | null;
  averageMonthlyDeposit: number;
}
