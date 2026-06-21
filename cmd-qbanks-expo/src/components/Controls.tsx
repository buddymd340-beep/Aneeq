import { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  useColorScheme,
  View,
} from "react-native";

import { getTheme, palette } from "../theme/theme";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";

export function CMDButton({
  children,
  variant = "primary",
  onPress,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  onPress?: () => void;
}) {
  const theme = getTheme(useColorScheme());
  const backgroundColor =
    variant === "primary"
      ? palette.green
      : variant === "secondary"
        ? palette.blue
        : variant === "destructive"
          ? palette.red
          : "transparent";
  const borderColor = variant === "ghost" ? theme.border : backgroundColor;
  const color = variant === "ghost" ? theme.text : "#FFFFFF";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor, opacity: pressed ? 0.82 : 1 },
      ]}
    >
      <Text style={[styles.buttonText, { color }]}>{children}</Text>
    </Pressable>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "blue" | "red" }) {
  const color =
    tone === "green" ? palette.green : tone === "blue" ? palette.blue : tone === "red" ? palette.red : "#64748B";
  return (
    <View style={[styles.pill, { backgroundColor: `${color}18` }]}>
      <Text style={[styles.pillText, { color }]}>{children}</Text>
    </View>
  );
}

export function Field(props: TextInputProps & { label: string }) {
  const theme = getTheme(useColorScheme());
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.muted }]}>{props.label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={theme.muted}
        style={[
          styles.input,
          { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
          props.style,
        ]}
      />
    </View>
  );
}

export function SettingRow({
  title,
  detail,
  right,
}: {
  title: string;
  detail?: string;
  right?: ReactNode;
}) {
  const theme = getTheme(useColorScheme());
  return (
    <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        {detail ? <Text style={[styles.settingDetail, { color: theme.muted }]}>{detail}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonText: {
    fontWeight: "800",
    fontSize: 15,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "800",
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 46,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  settingRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  settingDetail: {
    marginTop: 2,
    fontSize: 13,
  },
});
