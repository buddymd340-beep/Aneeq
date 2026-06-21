import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";

import { RootStackParamList } from "../navigation/types";
import { getTheme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList>;

type DatabaseRow = {
  icon: string;
  title: string;
  subtitle?: string;
  test?: boolean;
};

const sections: Array<{ title: string; rows: DatabaseRow[] }> = [
  {
    title: "Recent",
    rows: [
      {
        icon: "",
        title: "Test #144",
        subtitle: "UWorld USMLE STEP2 QBank - September 2025",
        test: true,
      },
      {
        icon: "◉",
        title: "UWorld USMLE STEP2 QBank - September 2025",
        subtitle: "Recent Documents",
      },
    ],
  },
  {
    title: "Access Medicine",
    rows: [
      { icon: "●", title: "John Murtagh's General Practice, 8e" },
      { icon: "NP", title: "McGraw-Hill's NPTE (National Physical Therapy Examination), 2e" },
      { icon: "●", title: "John Murtagh's General Practice Companion Handbook, 8e" },
      { icon: "●", title: "Quick Answers: Physiotherapy" },
      { icon: "●", title: "Katzung's Basic & Clinical Pharmacology, 16th Edition" },
      { icon: "●", title: "Internal Medicine: A Guide to Clinical Therapeutics" },
      { icon: "●", title: "The Johns Hopkins Handbook of Obstetrics and Gynecology" },
      { icon: "●", title: "Brukner & Khan's Clinical Sports Medicine: The Medicine of Exercise, Volume 2, 5e" },
    ],
  },
  {
    title: "AceQBank",
    rows: [{ icon: "◆", title: "AceQBank - MCCQE Part 1 QBank - 2025" }],
  },
  {
    title: "AMBOSS",
    rows: [
      { icon: "△", title: "Amboss Study Plan - High-Yield Ethics - 2025" },
      { icon: "△", title: "Amboss Study Plan - 200 Concepts That Appear in Every Step 2 Exam - 2025" },
      { icon: "△", title: "Amboss Study Plan - Step 2 Prep Condensed - 2025" },
    ],
  },
];

export function DatabasesScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());

  return (
    <View style={[styles.root, { backgroundColor: "#FFFFFF" }]}>
      <View style={[styles.nav, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.windowDots}>
          <View style={[styles.dot, { backgroundColor: "#FF605C" }]} />
          <View style={[styles.dot, { backgroundColor: "#FFBD44" }]} />
          <View style={[styles.dot, { backgroundColor: "#00CA4E" }]} />
        </View>
        <Text style={[styles.navTitle, { color: theme.text }]}>Databases</Text>
        <Pressable style={[styles.editButton, { backgroundColor: theme.background }]}>
          <Text style={[styles.editText, { color: theme.text }]}>Edit</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.search, { backgroundColor: "#FFFFFF" }]}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            placeholder="Search Databases"
            placeholderTextColor="#8C8F96"
            style={styles.searchInput}
          />
        </View>

        {sections.map((section) => (
          <View key={section.title}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <View style={styles.list}>
              {section.rows.map((row, index) => (
                <Pressable
                  key={`${section.title}-${index}`}
                  onPress={() =>
                    navigation.navigate("CreateTest", {
                      qbankId: 1,
                      title: row.title,
                    })
                  }
                  style={styles.row}
                >
                  {row.icon ? (
                    <View style={styles.iconCircle}>
                      <Text style={styles.iconText}>{row.icon}</Text>
                    </View>
                  ) : null}
                  <View style={{ flex: 1 }}>
                    {row.subtitle === "Recent Documents" ? (
                      <Text style={styles.recentLabel}>Recent Documents</Text>
                    ) : null}
                    <Text style={styles.rowTitle}>{row.title}</Text>
                    {row.subtitle && row.subtitle !== "Recent Documents" ? (
                      <Text style={styles.subtitle}>{row.subtitle}</Text>
                    ) : null}
                  </View>
                  {row.test ? <Text style={styles.chevron}>›</Text> : null}
                </Pressable>
              ))}
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
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  windowDots: {
    flexDirection: "row",
    width: 64,
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  editButton: {
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: "center",
  },
  editText: {
    fontWeight: "800",
    fontSize: 16,
  },
  content: {
    paddingBottom: 108,
  },
  search: {
    marginHorizontal: 18,
    marginVertical: 12,
    borderRadius: 18,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
  },
  searchIcon: {
    fontSize: 24,
    color: "#111827",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionHeader: {
    backgroundColor: "#ECEEF3",
    color: "#8A8D96",
    paddingHorizontal: 18,
    paddingVertical: 11,
    fontSize: 16,
  },
  list: {
    backgroundColor: "#FFFFFF",
  },
  row: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D8D8D8",
    paddingHorizontal: 18,
    gap: 12,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EAF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#0A84FF",
    fontSize: 14,
    fontWeight: "900",
  },
  rowTitle: {
    fontSize: 16,
    color: "#34383F",
    paddingVertical: 3,
  },
  subtitle: {
    fontSize: 12,
    color: "#9CA0A8",
  },
  recentLabel: {
    fontSize: 16,
    color: "#111827",
    marginTop: 6,
  },
  chevron: {
    color: "#B4B4B4",
    fontSize: 30,
  },
});
