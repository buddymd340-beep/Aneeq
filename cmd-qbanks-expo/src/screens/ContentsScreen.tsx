import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { CMDButton, Field, Pill } from "../components/Controls";
import { BodyText, Card, Screen, SectionTitle } from "../components/Layout";
import { buildMediaFolderStructure } from "../services/importer";
import { getTheme } from "../theme/theme";

const sections = ["Questions", "Explanations", "Tables", "References", "Labs", "PDF", "Audio", "Video"];

export function ContentsScreen() {
  const theme = getTheme(useColorScheme());
  return (
    <Screen title="Contents">
      <Card>
        <SectionTitle>Content Search</SectionTitle>
        <Field label="Search downloaded content" placeholder="Search stem, explanation, objective, notes" />
      </Card>

      <Card>
        <SectionTitle>Downloaded Media Structure</SectionTitle>
        {buildMediaFolderStructure().map((path) => (
          <Text key={path} style={[styles.path, { color: theme.muted, borderColor: theme.border }]}>
            {path}
          </Text>
        ))}
      </Card>

      <Card>
        <SectionTitle>Content Library</SectionTitle>
        <View style={styles.grid}>
          {sections.map((section) => (
            <View key={section} style={[styles.tile, { backgroundColor: theme.background }]}>
              <Pill tone="blue">{section}</Pill>
              <BodyText muted>Offline local files and indexed SQLite references.</BodyText>
              <CMDButton variant="ghost">Open</CMDButton>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  path: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    fontFamily: "monospace",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tile: {
    minWidth: 190,
    flex: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
});
