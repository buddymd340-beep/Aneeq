import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { CMDButton, Field } from "../components/Controls";
import { BodyText, Card, Screen, SectionTitle } from "../components/Layout";
import { RootStackParamList } from "../navigation/types";
import { getTheme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());
  const [server, setServer] = useState("Main Server - USA");

  function enterApp() {
    navigation.replace("MainTabs", { screen: "Titles" });
  }

  return (
    <Screen title="Login / Register">
      <View style={styles.logoWrap}>
        <View style={[styles.logo, { backgroundColor: theme.primary }]}>
          <Text style={styles.logoText}>CMD</Text>
        </View>
        <Text style={[styles.appName, { color: theme.text }]}>CMD Qbanks</Text>
        <BodyText muted>Tablet-first offline medical QBank reader</BodyText>
      </View>

      <View style={styles.authGrid}>
        <Card>
          <SectionTitle>Login</SectionTitle>
          <View style={styles.form}>
            <Field label="Username or email" placeholder="doctor@example.com" autoCapitalize="none" />
            <Field label="Password" placeholder="Password" secureTextEntry />
            <Field label="Server selector" value={server} onChangeText={setServer} />
            <CMDButton onPress={enterApp}>Login</CMDButton>
            <CMDButton variant="ghost">Forgot password</CMDButton>
          </View>
        </Card>

        <Card>
          <SectionTitle>Register</SectionTitle>
          <View style={styles.form}>
            <Field label="Email" placeholder="new@example.com" autoCapitalize="none" />
            <Field label="Password" placeholder="Create password" secureTextEntry />
            <CMDButton onPress={enterApp} variant="secondary">
              Register
            </CMDButton>
            <BodyText muted>
              Production auth should connect to Supabase Auth or Firebase Auth with secure token storage.
            </BodyText>
          </View>
        </Card>
      </View>

      <Text style={[styles.version, { color: theme.muted }]}>CMD Qbanks version 0.1.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  logo: {
    width: 86,
    height: 86,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 24,
  },
  appName: {
    fontSize: 28,
    fontWeight: "900",
  },
  authGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  form: {
    gap: 14,
    minWidth: 280,
    flex: 1,
  },
  version: {
    textAlign: "center",
    fontWeight: "700",
  },
});
