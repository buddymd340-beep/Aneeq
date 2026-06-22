import CryptoJS from "crypto-js";
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from "expo-secure-store";

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

  const db = await FileSystem.getInfoAsync(qbankDbPath(1));
  if (!db.exists) {
    await FileSystem.writeAsStringAsync(qbankDbPath(1), "", {
      encoding: FileSystem.EncodingType.UTF8,
    });
  }
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
    messages,
  };
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
