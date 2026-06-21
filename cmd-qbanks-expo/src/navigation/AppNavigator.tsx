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
    <Text style={{ fontSize: 23, fontWeight: "900", opacity: focused ? 1 : 0.55 }}>
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
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 16,
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          minHeight: 64,
          paddingTop: 6,
          paddingBottom: 8,
          borderRadius: 34,
          borderWidth: 1,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 5,
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
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="⌕" /> }}
      />
      <Tabs.Screen
        name="Databases"
        component={DatabasesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="▤" /> }}
      />
      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Bookmarks", tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="★" /> }}
      />
      <Tabs.Screen
        name="Contents"
        component={ContentsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="⌕" /> }}
      />
      <Tabs.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="♟" /> }}
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
      <Stack.Screen name="CreateTest" component={CreateTestScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="QuestionTest"
        component={QuestionTestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PreviousTests"
        component={PreviousTestsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Progress" component={ProgressScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
