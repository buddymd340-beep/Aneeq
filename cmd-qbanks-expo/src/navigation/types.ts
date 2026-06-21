import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  CreateTest: { qbankId: number; title: string };
  QuestionTest: { testId?: number; qbankId: number };
  PreviousTests: { qbankId?: number };
  Progress: { qbankId?: number };
};

export type MainTabParamList = {
  Titles: undefined;
  Databases: undefined;
  Favorites: undefined;
  Contents: undefined;
  Account: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
