import { ReactNode } from "react";
import {
  ColorSchemeName,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

import { getTheme } from "../theme/theme";

export function Screen({ title, children }: { title: string; children: ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.kicker, { color: theme.primary }]}>CMD Qbanks</Text>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isTablet ? styles.tabletContent : styles.phoneContent,
        ]}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function Card({ children }: { children: ReactNode }) {
  const theme = getTheme(useColorScheme());
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {children}
    </View>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  const theme = getTheme(useColorScheme());
  return <Text style={[styles.sectionTitle, { color: theme.text }]}>{children}</Text>;
}

export function BodyText({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  const theme = getTheme(useColorScheme());
  return <Text style={[styles.body, { color: muted ? theme.muted : theme.text }]}>{children}</Text>;
}

export function Grid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

export function themeFor(mode: ColorSchemeName) {
  return getTheme(mode);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: "800",
  },
  content: {
    gap: 16,
    paddingBottom: 32,
  },
  tabletContent: {
    padding: 24,
    maxWidth: 1180,
    width: "100%",
    alignSelf: "center",
  },
  phoneContent: {
    padding: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
