import { ColorSchemeName } from "react-native";

export const palette = {
  green: "#18A058",
  greenDark: "#0E7A42",
  blue: "#2563EB",
  red: "#DC2626",
  amber: "#F59E0B",
  lightBg: "#F3F5F7",
  lightCard: "#FFFFFF",
  lightText: "#162033",
  lightMuted: "#667085",
  lightBorder: "#D8DEE8",
  darkBg: "#101318",
  darkCard: "#171B22",
  darkText: "#F8FAFC",
  darkMuted: "#AAB3C2",
  darkBorder: "#303845",
};

export function getTheme(mode: ColorSchemeName) {
  const isDark = mode === "dark";
  return {
    isDark,
    background: isDark ? palette.darkBg : palette.lightBg,
    card: isDark ? palette.darkCard : palette.lightCard,
    text: isDark ? palette.darkText : palette.lightText,
    muted: isDark ? palette.darkMuted : palette.lightMuted,
    border: isDark ? palette.darkBorder : palette.lightBorder,
    primary: palette.green,
    primaryDark: palette.greenDark,
    secondary: palette.blue,
    destructive: palette.red,
    warning: palette.amber,
  };
}

export type CMDTheme = ReturnType<typeof getTheme>;
