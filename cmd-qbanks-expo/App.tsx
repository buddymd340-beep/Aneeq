import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useColorScheme } from "react-native";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { runLaunchFlow } from "./src/services/appStateFiles";
import { initializeDatabase } from "./src/storage/database";

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const [ready, setReady] = useState(false);
  const [startupError, setStartupError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([initializeDatabase(), runLaunchFlow()])
      .then(() => setReady(true))
      .catch((error) => {
        setStartupError(error instanceof Error ? error.message : String(error));
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading CMD Qbanks files...</Text>
      </View>
    );
  }

  if (startupError) {
    return (
      <View style={{ flex: 1, padding: 24, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontWeight: "800", marginBottom: 8 }}>Startup problem</Text>
        <Text>{startupError}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <AppNavigator />
    </NavigationContainer>
  );
}
