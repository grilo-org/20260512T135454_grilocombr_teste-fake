import { v4 as uuidv4 } from 'uuid';
import { Goal, Deposit, GoalCategory } from '../../domain/models';
import { getGoals, saveGoals } from '../storage';

export interface IGoalRepository {
  getAll(): Promise<Goal[]>;
  getById(id: string): Promise<Goal | null>;
  create(data: {
    name: string;
    targetValue: number;
    deadline: string;
    category: GoalCategory;
  }): Promise<Goal>;
  update(id: string, data: Partial<Goal>): Promise<Goal>;
  delete(id: string): Promise<void>;
  addDeposit(goalId: string, amount: number, date: string): Promise<Deposit>;
}

export class GoalRepository implements IGoalRepository {
  async getAll(): Promise<Goal[]> {
    return getGoals();
  }

  async getById(id: string): Promise<Goal | null> {
    const goals = await getGoals();
    return goals.find((g) => g.id === id) || null;
  }

  async create(data: {
    name: string;
    targetValue: number;
    deadline: string;
    category: GoalCategory;
  }): Promise<Goal> {
    const goals = await getGoals();
    const newGoal: Goal = {
      id: uuidv4(),
      name: data.name,
      targetValue: data.targetValue,
      deadline: data.deadline,
      category: data.category,
      createdAt: new Date().toISOString(),
      deposits: [],
    };
    goals.push(newGoal);
    await saveGoals(goals);
    return newGoal;
  }

  async update(id: string, data: Partial<Goal>): Promise<Goal> {
    const goals = await getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goals[index] = { ...goals[index], ...data };
    await saveGoals(goals);
    return goals[index];
  }

  async delete(id: string): Promise<void> {
    const goals = await getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    await saveGoals(filtered);
  }

  async addDeposit(goalId: string, amount: number, date: string): Promise<Deposit> {
    const goals = await getGoals();
    const index = goals.findIndex((g) => g.id === goalId);
    if (index === -1) {
      throw new Error('Goal not found');
    }

    const deposit: Deposit = {
      id: uuidv4(),
      goalId,
      amount,
      date,
      createdAt: new Date().toISOString(),
    };

    goals[index].deposits.push(deposit);
    await saveGoals(goals);
    return deposit;
  }
}

export const goalRepository = new GoalRepository();
