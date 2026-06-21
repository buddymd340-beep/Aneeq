import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Svg, { Circle, Ellipse, Line, Path, Rect, Text as SvgText } from "react-native-svg";

import { RootStackParamList } from "../navigation/types";
import { explainWithAI } from "../services/ai";
import { getTheme } from "../theme/theme";
import { Answer, Question } from "../types/schema";

type Props = NativeStackScreenProps<RootStackParamList, "QuestionTest">;

const question: Question = {
  id: 23,
  qbank_id: 1,
  qid: 1023,
  stem_html:
    "A 75-year-old man comes to the office due to right-sided abdominal pain. He has also experienced progressive fatigue and an unintentional weight loss of 7 kg (15.4 lb) in the past 2 months. He previously refused to undergo colon cancer screening. Medical and family history are unremarkable. Temperature is 37.4 C (99.3 F), blood pressure is 140/80 mm Hg, and pulse is 80/min. Mucosal pallor is present. There is no palpable lymphadenopathy, and cardiopulmonary examination is unremarkable. The abdomen is soft and mildly tender in the right flank area. Abdominal CT scan reveals a large tumor in the right colon with near obstruction of the colonic lumen as well as a 2.1-cm mass in the right hepatic lobe. Liver biopsy of the mass confirms metastatic colon adenocarcinoma. There is no evidence of other metastases. Which of the following is the most appropriate next step in management of this patient?",
  explanation_html:
    "This patient has adenocarcinoma of the colon with metastatic spread limited to the liver. Liver metastasis is present at the time of diagnosis in up to 25% of cases; the liver is the most common location of colon cancer metastasis because the venous system of the colon drains directly into the portal circulation, facilitating intrahepatic spread. Whenever possible, patients with adenocarcinoma of the colon should be offered surgical resection with curative intent. When metastatic spread is confined to the liver, surgical resection of both the hepatic mass and the primary tumor can be curative.",
  educational_objective:
    "Colon cancer with isolated resectable liver metastasis can be treated with curative-intent surgical resection of both lesions.",
  correct_answer_id: 5,
  subject_id: 1,
  system_id: 1,
  topic_id: 1,
  difficulty: "Medium",
  question_type: 1,
  question_format_type: 1,
  parent_qid: null,
  people_taken: 1580,
  correct_taken: 884,
  correct_percentage: 56,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const answers: Answer[] = [
  answer(1, "A", "Chemotherapy and radiation", 0, 24),
  answer(2, "B", "Chemotherapy only", 0, 8),
  answer(3, "C", "Liver transplantation", 0, 2),
  answer(4, "D", "Palliative care only", 0, 10),
  answer(5, "E", "Surgical resection", 1, 56),
];

const toolbarItems = ["−", "+", "‹", "›", "■", "⌕", "PDF", "▧", "♡", "Lab", "◐", "☰"];

export function QuestionTestScreen({ navigation }: Props) {
  const theme = getTheme(useColorScheme());
  const [selectedAnswerId, setSelectedAnswerId] = useState(4);
  const [showImage, setShowImage] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const ai = explainWithAI({ question, answers });
  const selected = answers.find((item) => item.id === selectedAnswerId);
  const correct = answers.find((item) => item.is_correct === 1);

  return (
    <View style={styles.root}>
      <View style={styles.nav}>
        <Pressable style={styles.circle} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.navTitle}>Question 23 Of 40</Text>
        <Pressable style={styles.circle}>
          <Text style={styles.home}>⌂</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.stem}>{question.stem_html}</Text>
        <View style={styles.options}>
          {answers.map((item) => {
            const checked = selectedAnswerId === item.id;
            return (
              <Pressable key={item.id} onPress={() => setSelectedAnswerId(item.id)} style={styles.option}>
                <Text style={styles.check}>{checked ? "◉" : "○"}</Text>
                <Text style={styles.optionText}>
                  {item.answer_label}. {item.answer_text_html} [{item.correct_percentage}%]
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selected ? (
          <View style={styles.resultBox}>
            <Text style={selected.is_correct ? styles.correct : styles.incorrect}>
              {selected.is_correct ? "Correct" : "Incorrect."}
              {!selected.is_correct ? <Text style={styles.resultText}> Correct answer is {correct?.answer_label}</Text> : null}
            </Text>
            <Text style={styles.resultText}>{correct?.correct_percentage}% answered correctly</Text>
          </View>
        ) : null}

        <Text style={styles.explanationTitle}>Explanation:</Text>
        <Text style={styles.paragraph}>
          This patient has <Text style={styles.bold}>adenocarcinoma of the colon</Text> with{" "}
          <Text style={styles.bold}>metastatic spread limited to the liver</Text>. Liver metastasis is
          present at the time of diagnosis in up to 25% of cases; the liver is the most common
          location of colon cancer metastasis because the{" "}
          <Text style={styles.link} onPress={() => setShowImage(true)}>
            venous system of the colon
          </Text>{" "}
          drains directly into the portal circulation, facilitating intrahepatic spread.
        </Text>
        <Text style={styles.paragraph}>
          Whenever possible, patients with adenocarcinoma of the colon should be offered{" "}
          <Text style={styles.bold}>surgical resection with curative intent</Text>. When metastatic
          spread is confined to the liver, surgical resection of{" "}
          <Text style={styles.bold}>both the hepatic mass and the primary tumor</Text> can be
          curative.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>(Choices A and B)</Text> Chemotherapy is commonly employed to
          prolong survival in patients with unresectable metastatic colon cancer. However, it is not
          curative and is not preferred over surgical resection for isolated liver metastasis.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>(Choice C)</Text> Liver transplantation is contraindicated in
          patients with primary nonhepatic tumors.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>(Choice D)</Text> Palliative care only would not be advisable if
          the patient can tolerate a potentially curative surgical approach.
        </Text>

        {showAI ? (
          <View style={styles.aiBox}>
            <Text style={styles.explanationTitle}>AI</Text>
            <Text style={styles.paragraph}>{ai.ai_summary}</Text>
            <Text style={styles.paragraph}>{ai.memory_hook}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.toolbar}>
        {toolbarItems.map((item) => (
          <Pressable
            key={item}
            style={styles.toolButton}
            onPress={() => {
              if (item === "▧") setShowImage(true);
              if (item === "☰") setShowAI((value) => !value);
              if (item === "■") navigation.goBack();
            }}
          >
            <Text style={styles.toolText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Modal visible={showImage} animationType="fade" onRequestClose={() => setShowImage(false)}>
        <View style={styles.imageModal}>
          <Pressable style={styles.modalClose} onPress={() => setShowImage(false)}>
            <Text style={styles.modalCloseText}>×</Text>
          </Pressable>
          <View style={styles.diagramCard}>
            <PortalDiagram />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function answer(id: number, answer_label: string, answer_text_html: string, is_correct: number, correct_percentage: number): Answer {
  return {
    id,
    qbank_id: 1,
    question_id: 23,
    qid: 1023,
    answer_label,
    answer_text_html,
    is_correct,
    correct_percentage,
    explanation_html: "",
  };
}

function PortalDiagram() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 520 560">
      <Rect x={0} y={0} width={520} height={560} fill="#FFFFFF" />
      <SvgText x={190} y={34} fontSize={20} fontWeight="700" fill="#1F2937">
        Portal venous system
      </SvgText>
      <Path d="M150 120 C200 50 330 60 380 120 C330 150 220 155 150 120Z" fill="#A94C38" />
      <Ellipse cx={320} cy={185} rx={92} ry={44} fill="#F3A076" />
      <Ellipse cx={430} cy={170} rx={26} ry={58} fill="#7056A6" />
      <Path
        d="M180 300 C135 250 160 200 225 216 C280 230 270 290 225 300 C190 308 190 358 235 365 C310 380 350 332 322 290"
        fill="none"
        stroke="#F07C55"
        strokeWidth={36}
        strokeLinecap="round"
      />
      <Path
        d="M345 300 C420 250 465 290 438 360 C420 410 350 410 340 350"
        fill="none"
        stroke="#F07C55"
        strokeWidth={36}
        strokeLinecap="round"
      />
      <Path d="M260 170 L260 355" stroke="#285A9B" strokeWidth={10} />
      <Path d="M260 220 C205 215 180 240 160 280" stroke="#285A9B" strokeWidth={5} fill="none" />
      <Path d="M260 235 C330 230 390 255 435 300" stroke="#285A9B" strokeWidth={5} fill="none" />
      <Path d="M260 170 C305 150 345 155 385 172" stroke="#285A9B" strokeWidth={5} fill="none" />
      <Path d="M260 170 C245 130 220 110 180 100" stroke="#285A9B" strokeWidth={5} fill="none" />
      {[
        ["Portal vein", 35, 174, 238, 172],
        ["Left gastric vein", 386, 84, 320, 144],
        ["Splenic vein", 402, 205, 330, 198],
        ["Superior mesenteric vein", 38, 298, 238, 260],
        ["Right colic vein", 44, 370, 230, 320],
        ["Left colic vein", 420, 360, 340, 328],
        ["Sigmoid & superior rectal veins", 380, 442, 335, 365],
      ].map(([label, tx, ty, x2, y2]) => (
        <Svg key={String(label)}>
          <Line x1={Number(tx) + 85} y1={Number(ty) - 5} x2={Number(x2)} y2={Number(y2)} stroke="#111827" />
          <SvgText x={Number(tx)} y={Number(ty)} fontSize={13} fill="#111827">
            {String(label)}
          </SvgText>
        </Svg>
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  nav: {
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D8D8D8",
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
  backText: {
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
    paddingTop: 16,
    paddingBottom: 92,
  },
  stem: {
    color: "#111111",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 14,
  },
  options: {
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 22,
  },
  check: {
    width: 28,
    color: "#0A84FF",
    fontSize: 18,
  },
  optionText: {
    fontSize: 15,
    color: "#111111",
  },
  resultBox: {
    backgroundColor: "#E3F8FA",
    borderWidth: 1,
    borderColor: "#BBDDE2",
    padding: 9,
    marginBottom: 16,
  },
  correct: {
    color: "#008000",
    fontWeight: "800",
  },
  incorrect: {
    color: "#FF1010",
    fontWeight: "800",
  },
  resultText: {
    color: "#111111",
    fontWeight: "400",
  },
  explanationTitle: {
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#111111",
    marginBottom: 14,
  },
  bold: {
    fontWeight: "900",
  },
  link: {
    color: "#0A84FF",
  },
  aiBox: {
    backgroundColor: "#F2F7FF",
    borderLeftWidth: 4,
    borderLeftColor: "#0A84FF",
    padding: 12,
    marginBottom: 18,
  },
  toolbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 58,
    backgroundColor: "rgba(255,255,255,0.94)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
  toolButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toolText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "800",
  },
  imageModal: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 26,
  },
  diagramCard: {
    width: "100%",
    maxWidth: 760,
    aspectRatio: 0.86,
    backgroundColor: "#FFFFFF",
  },
  modalClose: {
    position: "absolute",
    top: 28,
    right: 24,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 32,
  },
});
