import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

import { samplePreviousTests } from "../data/sampleData";
import { RootStackParamList } from "../navigation/types";
import { getTheme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "PreviousTests">;

export function PreviousTestsScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());
  const tests = [
    ...samplePreviousTests,
    { ...samplePreviousTests[0], id: 143, title: "Test #143", score: "55%" },
    { ...samplePreviousTests[0], id: 142, title: "Test #142", score: "60%" },
    { ...samplePreviousTests[0], id: 141, title: "Test #141", score: "52%" },
    { ...samplePreviousTests[0], id: 140, title: "Test #140", score: "70%" },
    { ...samplePreviousTests[0], id: 139, title: "Test #139", score: "48%" },
  ];

  return (
    <View style={[styles.root, { backgroundColor: "#FFFFFF" }]}>
      <View style={[styles.nav, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Pressable style={styles.circle} onPress={() => navigation.goBack()}>
          <Text style={styles.circleText}>‹</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: theme.text }]}>Tests</Text>
        <Pressable style={styles.circle}>
          <Text style={styles.home}>⌂</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {tests.map((test) => (
          <View key={test.id} style={styles.testRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.testTitle}>{test.title}</Text>
              <Text style={styles.meta}>40 Qs, Reading</Text>
              <Text style={styles.meta}>Created: {test.created_at.replace("T", " ").slice(0, 19)} +0500|00:00</Text>
              <Text numberOfLines={4} style={styles.filters}>
                All Subjects | Gastrointestinal & Nutrition (Biliary tract disorders) |
                Gastrointestinal & Nutrition (Congenital and developmental anomalies) |
                Gastrointestinal & Nutrition (Disorders of nutrition) | Gastrointestinal &
                Nutrition (Gastroesophageal disorders) | Gastrointestinal & Nutrition (Hepatic d...
              </Text>
              <View style={styles.links}>
                <Text style={styles.copy}>Copy QIDs</Text>
                <Text style={styles.delete}>Delete</Text>
              </View>
            </View>
            <View style={styles.scoreCircle}>
              <Text style={styles.score}>Score{"\n"}{test.score}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  nav: {
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 18,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontSize: 34,
    lineHeight: 34,
    color: "#111827",
  },
  home: {
    fontSize: 25,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 108,
  },
  testRow: {
    minHeight: 164,
    flexDirection: "row",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D8D8D8",
  },
  testTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    color: "#8A8D96",
    fontSize: 13,
  },
  filters: {
    color: "#C1C3C8",
    lineHeight: 17,
    marginTop: 8,
  },
  links: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
  },
  copy: {
    color: "#008DFF",
    fontWeight: "800",
    fontSize: 13,
  },
  delete: {
    color: "#FF383E",
    fontWeight: "800",
    fontSize: 13,
  },
  scoreCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#2E9668",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  score: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 15,
  },
});
