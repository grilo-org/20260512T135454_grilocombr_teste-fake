import { Goal, Deposit, GoalWithProgress } from './models';

export function calculateCurrentBalance(goal: Goal): number {
  return goal.deposits.reduce((sum: number, deposit: Deposit) => sum + deposit.amount, 0);
}

export function calculateProgressPercentage(goal: Goal): number {
  const currentBalance = calculateCurrentBalance(goal);
  if (goal.targetValue <= 0) return 0;
  const percentage = (currentBalance / goal.targetValue) * 100;
  return Math.min(percentage, 100);
}

export function calculateAverageMonthlyDeposit(goal: Goal): number {
  if (goal.deposits.length === 0) return 0;
  
  const sortedDeposits = [...goal.deposits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstDate = new Date(sortedDeposits[0].date);
  const lastDate = new Date(sortedDeposits[sortedDeposits.length - 1].date);
  
  const totalAmount = sortedDeposits.reduce((sum: number, d: Deposit) => sum + d.amount, 0);
  
  const monthsDiff = Math.max(1, getMonthsDifference(firstDate, lastDate) + 1);
  
  return totalAmount / monthsDiff;
}

export function getMonthsDifference(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

export function calculateProjectedCompletionDate(
  goal: Goal,
  averageMonthlyDeposit: number
): Date | null {
  if (averageMonthlyDeposit <= 0) return null;
  
  const currentBalance = calculateCurrentBalance(goal);
  const remainingAmount = goal.targetValue - currentBalance;
  
  if (remainingAmount <= 0) return new Date();
  
  const monthsNeeded = Math.ceil(remainingAmount / averageMonthlyDeposit);
  const projectedDate = new Date();
  projectedDate.setMonth(projectedDate.getMonth() + monthsNeeded);
  
  return projectedDate;
}

export function calculateGoalWithProgress(goal: Goal): GoalWithProgress {
  const currentBalance = calculateCurrentBalance(goal);
  const progressPercentage = calculateProgressPercentage(goal);
  const averageMonthlyDeposit = calculateAverageMonthlyDeposit(goal);
  const projectedDate = calculateProjectedCompletionDate(goal, averageMonthlyDeposit);
  
  return {
    ...goal,
    currentBalance,
    progressPercentage,
    projectedCompletionDate: projectedDate ? projectedDate.toISOString() : null,
    averageMonthlyDeposit,
  };
}

export function isMilestoneReached(goal: Goal, milestone: number = 50): boolean {
  const progress = calculateProgressPercentage(goal);
  const previousDeposits = goal.deposits.slice(0, -1);
  const previousBalance = previousDeposits.reduce((sum: number, d: Deposit) => sum + d.amount, 0);
  const previousPercentage = (previousBalance / goal.targetValue) * 100;
  
  return progress >= milestone && previousPercentage < milestone;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
