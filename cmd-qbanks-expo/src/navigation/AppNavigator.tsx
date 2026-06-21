import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, useColorScheme } from "react-native";

import { AccountScreen } from "../screens/AccountScreen";
import { ContentsScreen } from "../screens/ContentsScreen";
import { CreateTestScreen } from "../screens/CreateTestScreen";
import { DatabasesScreen } from "../screens/DatabasesScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { PreviousTestsScreen } from "../screens/PreviousTestsScreen";
import { ProgressScreen } from "../screens/ProgressScreen";
import { QuestionTestScreen } from "../screens/QuestionTestScreen";
import { TitlesScreen } from "../screens/TitlesScreen";
import { getTheme } from "../theme/theme";
import { MainTabParamList, RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 12, fontWeight: "800", opacity: focused ? 1 : 0.55 }}>
      {label}
    </Text>
  );
}

function MainTabs() {
  const theme = getTheme(useColorScheme());
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          minHeight: 70,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontWeight: "800",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="Titles"
        component={TitlesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="TI" /> }}
      />
      <Tabs.Screen
        name="Databases"
        component={DatabasesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="DB" /> }}
      />
      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="FA" /> }}
      />
      <Tabs.Screen
        name="Contents"
        component={ContentsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="CO" /> }}
      />
      <Tabs.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="AC" /> }}
      />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const theme = getTheme(useColorScheme());
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: "800" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreateTest" component={CreateTestScreen} options={{ title: "Create Test" }} />
      <Stack.Screen
        name="QuestionTest"
        component={QuestionTestScreen}
        options={{ title: "Question Reader" }}
      />
      <Stack.Screen
        name="PreviousTests"
        component={PreviousTestsScreen}
        options={{ title: "Previous Tests" }}
      />
      <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: "Progress" }} />
    </Stack.Navigator>
  );
}
