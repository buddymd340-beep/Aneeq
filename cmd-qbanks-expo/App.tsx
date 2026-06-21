import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { initializeDatabase } from "./src/storage/database";

initializeDatabase().catch((error) => {
  console.warn("Database initialization failed", error);
});

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <AppNavigator />
    </NavigationContainer>
  );
}
