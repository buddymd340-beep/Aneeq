import CryptoJS from "crypto-js";
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";

export type BackupFlag = 0 | 1;

export interface BackupState {
  date: string | null;
  flag: BackupFlag;
  needsSync: boolean;
}

export interface FilterState {
  status: number[];
  subjects: number[];
  systems: number[];
  topics: number[];
  mode: number[];
}

export interface LicenseInfo {
  userId: string;
  email: string;
  subscriptionTier: "free" | "premium" | "enterprise";
  expiryDate: string;
  deviceId: string;
  features: Record<string, boolean>;
  activationDate: string;
}

export interface LaunchState {
  activated: boolean;
  license: LicenseInfo | null;
  backup: BackupState;
  filters: FilterState;
  qbankDbPath: string;
  qbankJournalPath: string;
  demoMediaPath: string;
  messages: string[];
}

const APP_SALT = "CMD_QBANKS_LOCAL_LICENSE_SALT";
const SECURE_KEY_REF = "cmd_qbanks_crypto_v3_key_ref";
const DB_NAME = "boardvitals-126-2025.db";

const defaultFilters: FilterState = {
  status: [1],
  subjects: [],
  systems: [],
  topics: [],
  mode: [],
};

function documentRoot() {
  if (!FileSystem.documentDirectory) {
    throw new Error("FileSystem.documentDirectory is unavailable.");
  }
  return FileSystem.documentDirectory;
}

export function appFilePath(fileName: string) {
  return `${documentRoot()}${fileName}`;
}

export function qbankRoot(qbankId = 1) {
  return `${documentRoot()}storage/qbanks/qbank_${qbankId}`;
}

export function qbankDbPath(qbankId = 1) {
  return `${qbankRoot(qbankId)}/${DB_NAME}`;
}

export function qbankJournalPath(qbankId = 1) {
  return `${qbankDbPath(qbankId)}-journal`;
}

export async function initAppStateFiles() {
  await ensureDirectory(`${documentRoot()}storage`);
  await ensureDirectory(`${documentRoot()}storage/qbanks`);
  await ensureDirectory(qbankRoot(1));
  await ensureDirectory(`${qbankRoot(1)}/media`);
  await Promise.all(
    ["questions", "explanations", "tables", "references", "labs", "audio", "video", "pdf"].map(
      (folder) => ensureDirectory(`${qbankRoot(1)}/media/${folder}`),
    ),
  );

  await ensureFile("crypto_v2.txt", "");
  await ensureFile("crypto_v3.txt", "");
  await ensureFile("uwfilters.dat", JSON.stringify(defaultFilters));

  const backup = await FileSystem.getInfoAsync(appFilePath("backupstate.dat"));
  if (!backup.exists) {
    await writeBackupState(todayIsoDate(), 1);
  }

  await createDemoQBankFiles();
}

export async function runLaunchFlow(): Promise<LaunchState> {
  const messages: string[] = [];
  await initAppStateFiles();
  messages.push("State files initialized");

  await migrateCryptoV2ToV3IfNeeded();
  const license = await loadLicense();
  const activated = Boolean(license);
  messages.push(activated ? "License loaded from info.vbe" : "No valid license; show login/activation");

  const backup = await readBackupState();
  messages.push(backup.needsSync ? "Backup sync needed" : "Backup state clean");

  const filters = await readFilters();
  messages.push("Filters restored from uwfilters.dat");

  return {
    activated,
    license,
    backup,
    filters,
    qbankDbPath: qbankDbPath(1),
    qbankJournalPath: qbankJournalPath(1),
    demoMediaPath: `${qbankRoot(1)}/media/questions/portal_venous_system.svg`,
    messages,
  };
}

export async function createDemoQBankFiles() {
  await createDemoQBankDatabase();

  const portalSvgPath = `${qbankRoot(1)}/media/questions/portal_venous_system.svg`;
  const portalInfo = await FileSystem.getInfoAsync(portalSvgPath);
  if (!portalInfo.exists) {
    await FileSystem.writeAsStringAsync(portalSvgPath, demoPortalSvg());
  }

  const explanationPath = `${qbankRoot(1)}/media/explanations/qid_1023_explanation.txt`;
  const explanationInfo = await FileSystem.getInfoAsync(explanationPath);
  if (!explanationInfo.exists) {
    await FileSystem.writeAsStringAsync(
      explanationPath,
      "Demo explanation media for QID 1023. Blue linked words open portal_venous_system.svg.",
    );
  }

  const labsPath = `${qbankRoot(1)}/media/labs/normal_labs.txt`;
  const labsInfo = await FileSystem.getInfoAsync(labsPath);
  if (!labsInfo.exists) {
    await FileSystem.writeAsStringAsync(
      labsPath,
      "Hemoglobin 13.5-17.5 g/dL\nWBC 4,500-11,000/mm3\nPlatelets 150,000-400,000/mm3",
    );
  }

  const manifestPath = `${qbankRoot(1)}/media/question_media_manifest.json`;
  await FileSystem.writeAsStringAsync(
    manifestPath,
    JSON.stringify(
      [
        {
          qbank_id: 1,
          question_id: 23,
          qid: 1023,
          media_type: "image/svg+xml",
          file_name: "portal_venous_system.svg",
          local_path: portalSvgPath,
          caption: "Portal venous system",
          used_in: "explanation",
        },
      ],
      null,
      2,
    ),
  );
}

async function createDemoQBankDatabase() {
  try {
    const demoDb = SQLite.openDatabaseSync(DB_NAME, undefined, qbankRoot(1));
    await demoDb.execAsync(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS systems (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY,
        subject_id INTEGER,
        system_id INTEGER,
        stem TEXT NOT NULL,
        explanation TEXT,
        difficulty INTEGER DEFAULT 2,
        status INTEGER DEFAULT 0,
        is_flagged INTEGER DEFAULT 0,
        time_spent INTEGER DEFAULT 0,
        last_seen TEXT
      );
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY,
        question_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        is_correct INTEGER DEFAULT 0,
        explanation TEXT,
        sort_order INTEGER
      );
      CREATE TABLE IF NOT EXISTS question_media (
        id INTEGER PRIMARY KEY,
        question_id INTEGER,
        file_name TEXT,
        local_path TEXT,
        caption TEXT,
        used_in TEXT
      );
    `);
    await demoDb.runAsync("INSERT OR REPLACE INTO subjects (id, name) VALUES (?, ?)", [
      1,
      "Gastrointestinal & Nutrition",
    ]);
    await demoDb.runAsync("INSERT OR REPLACE INTO systems (id, name) VALUES (?, ?)", [
      1,
      "Colon cancer",
    ]);
    await demoDb.runAsync(
      `INSERT OR REPLACE INTO questions
       (id, subject_id, system_id, stem, explanation, difficulty, status, is_flagged, time_spent, last_seen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        23,
        1,
        1,
        "A 75-year-old man has right-sided abdominal pain, weight loss, colon adenocarcinoma, and isolated liver metastasis. What is the next step?",
        "Surgical resection of both the primary colon tumor and isolated liver metastasis can be curative.",
        2,
        0,
        0,
        0,
        "",
      ],
    );
    const answers = [
      [1, 23, "Chemotherapy and radiation", 0, "Not preferred for isolated resectable liver metastasis.", 1],
      [2, 23, "Chemotherapy only", 0, "Not curative when surgery is possible.", 2],
      [3, 23, "Liver transplantation", 0, "Contraindicated for primary nonhepatic tumors.", 3],
      [4, 23, "Palliative care only", 0, "Not appropriate if curative surgery is feasible.", 4],
      [5, 23, "Surgical resection", 1, "Correct.", 5],
    ];
    for (const answer of answers) {
      await demoDb.runAsync(
        "INSERT OR REPLACE INTO answers (id, question_id, text, is_correct, explanation, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
        answer,
      );
    }
    await demoDb.runAsync(
      "INSERT OR REPLACE INTO question_media (id, question_id, file_name, local_path, caption, used_in) VALUES (?, ?, ?, ?, ?, ?)",
      [
        1,
        23,
        "portal_venous_system.svg",
        `${qbankRoot(1)}/media/questions/portal_venous_system.svg`,
        "Portal venous system",
        "explanation",
      ],
    );
    await demoDb.closeAsync();
  } catch {
    const dbInfo = await FileSystem.getInfoAsync(qbankDbPath(1));
    if (!dbInfo.exists) {
      await FileSystem.writeAsStringAsync(
        qbankDbPath(1),
        "Demo QBank DB placeholder. If Expo cannot create SQLite in this folder on this platform, use cmd_qbanks.db plus media manifest.",
      );
    }
  }
}

export async function readBackupState(syncIntervalDays = 1): Promise<BackupState> {
  try {
    const encoded = await FileSystem.readAsStringAsync(appFilePath("backupstate.dat"), {
      encoding: FileSystem.EncodingType.Base64,
    });
    const raw = decodeJavaSerializedString(encoded);
    const [date, flagValue] = raw.split("|");
    const flag = Number(flagValue) === 0 ? 0 : 1;
    const daysSince = date ? (Date.now() - new Date(date).getTime()) / 86_400_000 : 999;
    return {
      date: date || null,
      flag,
      needsSync: flag === 1 || !date || daysSince > syncIntervalDays,
    };
  } catch {
    return { date: null, flag: 1, needsSync: true };
  }
}

export async function writeBackupState(date: string, flag: BackupFlag = 0) {
  await FileSystem.writeAsStringAsync(
    appFilePath("backupstate.dat"),
    encodeJavaSerializedString(`${date}|${flag}`),
    { encoding: FileSystem.EncodingType.Base64 },
  );
}

export async function markSyncNeeded() {
  const current = await readBackupState();
  await writeBackupState(current.date ?? todayIsoDate(), 1);
}

export async function markSyncComplete() {
  await writeBackupState(todayIsoDate(), 0);
}

export async function readFilters(): Promise<FilterState> {
  try {
    const raw = await FileSystem.readAsStringAsync(appFilePath("uwfilters.dat"));
    const parsed = JSON.parse(raw) as Partial<FilterState>;
    return {
      status: Array.isArray(parsed.status) ? parsed.status : [],
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects : [],
      systems: Array.isArray(parsed.systems) ? parsed.systems : [],
      topics: Array.isArray(parsed.topics) ? parsed.topics : [],
      mode: Array.isArray(parsed.mode) ? parsed.mode : [],
    };
  } catch {
    return defaultFilters;
  }
}

export async function saveFilters(filters: FilterState) {
  await FileSystem.writeAsStringAsync(appFilePath("uwfilters.dat"), JSON.stringify(filters, null, 2));
}

export async function resetFilters() {
  await saveFilters({ status: [], subjects: [], systems: [], topics: [], mode: [] });
}

export function buildQuestionQuery(filters: FilterState, limit = 40) {
  const conditions = ["1=1"];
  const params: number[] = [];

  appendInCondition("status", filters.status, conditions, params);
  appendInCondition("subject_id", filters.subjects, conditions, params);
  appendInCondition("system_id", filters.systems, conditions, params);
  appendInCondition("topic_id", filters.topics, conditions, params);

  return {
    sql: `SELECT * FROM questions WHERE ${conditions.join(" AND ")} ORDER BY RANDOM() LIMIT ?`,
    params: [...params, limit],
  };
}

export async function initCryptoFiles() {
  await ensureFile("crypto_v2.txt", "");
  await ensureFile("crypto_v3.txt", "");
}

export async function isActivated() {
  const info = await FileSystem.getInfoAsync(appFilePath("crypto_v3.txt"));
  if (!info.exists || (info.size ?? 0) === 0) {
    return false;
  }
  const content = await FileSystem.readAsStringAsync(appFilePath("crypto_v3.txt"));
  return content.trim().length > 0;
}

export async function saveLicense(license: LicenseInfo, userId: string, deviceId: string) {
  const keyRef = `${userId}|${deviceId}`;
  const key = deriveKey(userId, deviceId);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(license), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const payload = iv.clone().concat(encrypted.ciphertext);

  await FileSystem.writeAsStringAsync(appFilePath("info.vbe"), CryptoJS.enc.Base64.stringify(payload), {
    encoding: FileSystem.EncodingType.UTF8,
  });
  await FileSystem.writeAsStringAsync(appFilePath("crypto_v3.txt"), keyRef);
  await SecureStore.setItemAsync(SECURE_KEY_REF, keyRef);
}

export async function saveDemoLicense() {
  const deviceId = await getDeviceId();
  const license: LicenseInfo = {
    userId: "CMD-DEMO-USER",
    email: "demo@cmdqbanks.local",
    subscriptionTier: "premium",
    expiryDate: "2027-05-16",
    deviceId,
    activationDate: todayIsoDate(),
    features: {
      qbank: true,
      flashcards: true,
      analytics: true,
      ai: true,
      translation: true,
    },
  };
  await saveLicense(license, license.userId, deviceId);
  return license;
}

export async function loadLicense(): Promise<LicenseInfo | null> {
  try {
    let keyRef = await SecureStore.getItemAsync(SECURE_KEY_REF);
    if (!keyRef) {
      keyRef = await FileSystem.readAsStringAsync(appFilePath("crypto_v3.txt"));
    }
    if (!keyRef.trim()) {
      return null;
    }

    const [userId, deviceId] = keyRef.trim().split("|");
    const payloadBase64 = await FileSystem.readAsStringAsync(appFilePath("info.vbe"));
    const payloadBytes = wordArrayToBytes(CryptoJS.enc.Base64.parse(payloadBase64));
    if (payloadBytes.length <= 16) {
      return null;
    }

    const iv = bytesToWordArray(payloadBytes.slice(0, 16));
    const ciphertext = bytesToWordArray(payloadBytes.slice(16));
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext } as CryptoJS.lib.CipherParams,
      deriveKey(userId, deviceId),
      { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
    );
    const json = CryptoJS.enc.Utf8.stringify(decrypted);
    if (!json) {
      return null;
    }

    const license = JSON.parse(json) as LicenseInfo;
    if (new Date(license.expiryDate).getTime() < Date.now()) {
      return null;
    }
    if (license.deviceId !== deviceId) {
      return null;
    }
    return license;
  } catch {
    return null;
  }
}

export async function migrateCryptoV2ToV3IfNeeded() {
  const v2 = await FileSystem.getInfoAsync(appFilePath("crypto_v2.txt"));
  const v3 = await FileSystem.getInfoAsync(appFilePath("crypto_v3.txt"));
  if (v2.exists && (v2.size ?? 0) > 0 && (!v3.exists || (v3.size ?? 0) === 0)) {
    const legacyRef = await FileSystem.readAsStringAsync(appFilePath("crypto_v2.txt"));
    await FileSystem.writeAsStringAsync(appFilePath("crypto_v3.txt"), legacyRef);
    await FileSystem.writeAsStringAsync(appFilePath("crypto_v2.txt"), "");
  }
}

export async function getDeviceId() {
  const existing = await SecureStore.getItemAsync("cmd_qbanks_device_id");
  if (existing) {
    return existing;
  }
  const generated = `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await SecureStore.setItemAsync("cmd_qbanks_device_id", generated);
  return generated;
}

function appendInCondition(
  column: string,
  values: number[],
  conditions: string[],
  params: number[],
) {
  if (values.length === 0) {
    return;
  }
  conditions.push(`${column} IN (${values.map(() => "?").join(",")})`);
  params.push(...values);
}

function demoPortalSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 560">
  <rect width="520" height="560" fill="#ffffff"/>
  <text x="190" y="34" font-size="20" font-weight="700" fill="#1f2937">Portal venous system</text>
  <path d="M150 120 C200 50 330 60 380 120 C330 150 220 155 150 120Z" fill="#a94c38"/>
  <ellipse cx="320" cy="185" rx="92" ry="44" fill="#f3a076"/>
  <ellipse cx="430" cy="170" rx="26" ry="58" fill="#7056a6"/>
  <path d="M180 300 C135 250 160 200 225 216 C280 230 270 290 225 300 C190 308 190 358 235 365 C310 380 350 332 322 290" fill="none" stroke="#f07c55" stroke-width="36" stroke-linecap="round"/>
  <path d="M345 300 C420 250 465 290 438 360 C420 410 350 410 340 350" fill="none" stroke="#f07c55" stroke-width="36" stroke-linecap="round"/>
  <path d="M260 170 L260 355" stroke="#285a9b" stroke-width="10"/>
  <path d="M260 220 C205 215 180 240 160 280" stroke="#285a9b" stroke-width="5" fill="none"/>
  <path d="M260 235 C330 230 390 255 435 300" stroke="#285a9b" stroke-width="5" fill="none"/>
  <path d="M260 170 C305 150 345 155 385 172" stroke="#285a9b" stroke-width="5" fill="none"/>
  <path d="M260 170 C245 130 220 110 180 100" stroke="#285a9b" stroke-width="5" fill="none"/>
  <text x="35" y="174" font-size="13">Portal vein</text><line x1="120" y1="169" x2="238" y2="172" stroke="#111827"/>
  <text x="386" y="84" font-size="13">Left gastric vein</text><line x1="471" y1="79" x2="320" y2="144" stroke="#111827"/>
  <text x="402" y="205" font-size="13">Splenic vein</text><line x1="487" y1="200" x2="330" y2="198" stroke="#111827"/>
  <text x="38" y="298" font-size="13">Superior mesenteric vein</text><line x1="123" y1="293" x2="238" y2="260" stroke="#111827"/>
  <text x="44" y="370" font-size="13">Right colic vein</text><line x1="129" y1="365" x2="230" y2="320" stroke="#111827"/>
  <text x="420" y="360" font-size="13">Left colic vein</text><line x1="505" y1="355" x2="340" y2="328" stroke="#111827"/>
  <text x="380" y="442" font-size="13">Sigmoid &amp; superior rectal veins</text><line x1="465" y1="437" x2="335" y2="365" stroke="#111827"/>
</svg>`;
}

async function ensureDirectory(path: string) {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

async function ensureFile(fileName: string, content: string) {
  const path = appFilePath(fileName);
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.writeAsStringAsync(path, content);
  }
}

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

function deriveKey(userId: string, deviceId: string) {
  return CryptoJS.SHA256(`${userId}:${deviceId}:${APP_SALT}`);
}

function encodeJavaSerializedString(value: string) {
  const utf8 = stringToUtf8Bytes(value);
  if (utf8.length > 65535) {
    throw new Error("Serialized Java string is too long.");
  }
  const bytes = [0xac, 0xed, 0x00, 0x05, 0x74, (utf8.length >> 8) & 0xff, utf8.length & 0xff, ...utf8];
  return CryptoJS.enc.Base64.stringify(bytesToWordArray(bytes));
}

function decodeJavaSerializedString(base64Value: string) {
  const bytes = wordArrayToBytes(CryptoJS.enc.Base64.parse(base64Value));
  if (bytes[0] === 0xac && bytes[1] === 0xed && bytes[4] === 0x74) {
    const length = (bytes[5] << 8) | bytes[6];
    return utf8BytesToString(bytes.slice(7, 7 + length));
  }
  return utf8BytesToString(bytes);
}

function stringToUtf8Bytes(value: string) {
  return unescape(encodeURIComponent(value))
    .split("")
    .map((character) => character.charCodeAt(0));
}

function utf8BytesToString(bytes: number[]) {
  return decodeURIComponent(escape(String.fromCharCode(...bytes)));
}

function bytesToWordArray(bytes: number[]) {
  const words: number[] = [];
  for (let index = 0; index < bytes.length; index += 1) {
    words[index >>> 2] |= bytes[index] << (24 - (index % 4) * 8);
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

function wordArrayToBytes(wordArray: CryptoJS.lib.WordArray) {
  const bytes: number[] = [];
  for (let index = 0; index < wordArray.sigBytes; index += 1) {
    bytes.push((wordArray.words[index >>> 2] >>> (24 - (index % 4) * 8)) & 0xff);
  }
  return bytes;
}
