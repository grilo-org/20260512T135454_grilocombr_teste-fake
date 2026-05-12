export type RootStackParamList = {
  GoalList: undefined;
  GoalDetail: { goalId: string };
  CreateGoal: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
