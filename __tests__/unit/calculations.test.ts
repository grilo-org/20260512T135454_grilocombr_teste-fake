import {
  calculateCurrentBalance,
  calculateProgressPercentage,
  calculateAverageMonthlyDeposit,
  calculateProjectedCompletionDate,
  isMilestoneReached,
  calculateGoalWithProgress,
} from '../../src/domain/calculations';
import { Goal } from '../../src/domain/models';

const createMockGoal = (overrides: Partial<Goal> = {}): Goal => ({
  id: '1',
  name: 'Test Goal',
  targetValue: 1000,
  deadline: '2026-12-31',
  category: 'emergencia',
  createdAt: '2026-01-01T00:00:00Z',
  deposits: [],
  ...overrides,
});

describe('Domain Calculations', () => {
  describe('calculateCurrentBalance', () => {
    it('should return 0 for goal with no deposits', () => {
      const goal = createMockGoal();
      expect(calculateCurrentBalance(goal)).toBe(0);
    });

    it('should sum all deposits correctly', () => {
      const goal = createMockGoal({
        deposits: [
          { id: '1', goalId: '1', amount: 100, date: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
          { id: '2', goalId: '1', amount: 200, date: '2026-02-01', createdAt: '2026-02-01T00:00:00Z' },
          { id: '3', goalId: '1', amount: 50, date: '2026-03-01', createdAt: '2026-03-01T00:00:00Z' },
        ],
      });
      expect(calculateCurrentBalance(goal)).toBe(350);
    });
  });

  describe('calculateProgressPercentage', () => {
    it('should return 0 for goal with no deposits', () => {
      const goal = createMockGoal();
      expect(calculateProgressPercentage(goal)).toBe(0);
    });

    it('should calculate correct percentage', () => {
      const goal = createMockGoal({
        targetValue: 1000,
        deposits: [
          { id: '1', goalId: '1', amount: 250, date: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
        ],
      });
      expect(calculateProgressPercentage(goal)).toBe(25);
    });

    it('should cap percentage at 100', () => {
      const goal = createMockGoal({
        targetValue: 100,
        deposits: [
          { id: '1', goalId: '1', amount: 150, date: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
        ],
      });
      expect(calculateProgressPercentage(goal)).toBe(100);
    });

    it('should return 0 if target value is 0', () => {
      const goal = createMockGoal({ targetValue: 0 });
      expect(calculateProgressPercentage(goal)).toBe(0);
    });
  });

  describe('calculateAverageMonthlyDeposit', () => {
    it('should return 0 for goal with no deposits', () => {
      const goal = createMockGoal();
      expect(calculateAverageMonthlyDeposit(goal)).toBe(0);
    });

    it('should calculate average correctly for multiple deposits', () => {
      const goal = createMockGoal({
        deposits: [
          { id: '1', goalId: '1', amount: 100, date: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
          { id: '2', goalId: '1', amount: 100, date: '2026-02-01', createdAt: '2026-02-01T00:00:00Z' },
          { id: '3', goalId: '1', amount: 200, date: '2026-03-01', createdAt: '2026-03-01T00:00:00Z' },
        ],
      });
      expect(calculateAverageMonthlyDeposit(goal)).toBe(133.33333333333334);
    });
  });

  describe('calculateProjectedCompletionDate', () => {
    it('should return null if no deposits', () => {
      const goal = createMockGoal();
      const result = calculateProjectedCompletionDate(goal, 0);
      expect(result).toBeNull();
    });

    it('should return current date if goal is already achieved', () => {
      const goal = createMockGoal({
        targetValue: 100,
        deposits: [
          { id: '1', goalId: '1', amount: 150, date: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
        ],
      });
      const avgMonthly = calculateAverageMonthlyDeposit(goal);
      const result = calculateProjectedCompletionDate(goal, avgMonthly);
      expect(result).not.toBeNull();
    });

    it('should calculate future date based on average deposits', () => {
      const goal = createMockGoal({
        targetValue: 1200,
        deposits: [
          { id: '1', goalId: '1', amount: 100, date: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
          { id: '2', goalId: '1', amount: 100, date: '2026-02-01', createdAt: '2026-02-01T00:00:00Z' },
        ],
      });
      const avgMonthly = 100;
      const result = calculateProjectedCompletionDate(goal, avgMonthly);
      expect(result).not.toBeNull();
    });
  });

  describe('isMilestoneReached', () => {
    it('should return false when progress is below milestone', () => {
      const goal = createMockGoal({
        targetValue: 100,
        deposits: [
          { id: '1', goalId: '1', amount: 40, date: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
        ],
      });
      expect(isMilestoneReached(goal, 50)).toBe(false);
    });

    it('should return true when milestone is just reached', () => {
      const goal = createMockGoal({
        targetValue: 100,
        deposits: [
          { id: '1', goalId: '1', amount: 40, date: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
          { id: '2', goalId: '1', amount: 15, date: '2026-02-01', createdAt: '2026-02-01T00:00:00Z' },
        ],
      });
      expect(isMilestoneReached(goal, 50)).toBe(true);
    });
  });

  describe('calculateGoalWithProgress', () => {
    it('should return goal with calculated progress', () => {
      const goal = createMockGoal({
        targetValue: 1000,
        deposits: [
          { id: '1', goalId: '1', amount: 500, date: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
        ],
      });
      const result = calculateGoalWithProgress(goal);
      expect(result.currentBalance).toBe(500);
      expect(result.progressPercentage).toBe(50);
    });
  });
});
