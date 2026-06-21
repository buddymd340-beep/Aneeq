const assert = require("node:assert/strict");
const { test } = require("node:test");
const { webcrypto } = require("node:crypto");

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const {
  bytesToBase64,
  decryptWithPassword,
  parseEncryptedPayload,
} = require("../app.js");

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function encryptForTest(plaintext, password, metadata) {
  const baseKey = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await globalThis.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: metadata.salt,
      iterations: metadata.iterations,
      hash: metadata.hash,
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  return new Uint8Array(
    await globalThis.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: metadata.iv },
      key,
      encoder.encode(plaintext),
    ),
  );
}

test("decrypts AES-GCM files described by a JSON envelope", async () => {
  const metadata = {
    salt: Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]),
    iv: Uint8Array.from([11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]),
    iterations: 1000,
    hash: "SHA-256",
  };
  const ciphertext = await encryptForTest("hello decrypted world", "secret", metadata);
  const envelope = {
    version: 1,
    algorithm: "AES-GCM",
    kdf: "PBKDF2",
    hash: metadata.hash,
    iterations: metadata.iterations,
    salt: bytesToBase64(metadata.salt),
    iv: bytesToBase64(metadata.iv),
    ciphertext: bytesToBase64(ciphertext),
    mimeType: "text/plain",
    fileName: "hello.txt",
  };

  const payload = parseEncryptedPayload(
    encoder.encode(JSON.stringify(envelope)).buffer,
  );
  const decrypted = await decryptWithPassword(payload, "secret");

  assert.equal(decoder.decode(decrypted), "hello decrypted world");
  assert.equal(payload.mimeType, "text/plain");
  assert.equal(payload.fileName, "hello.txt");
});

test("decrypts raw AES-GCM ciphertext when salt and IV are supplied", async () => {
  const metadata = {
    salt: Uint8Array.from([21, 22, 23, 24, 25, 26, 27, 28]),
    iv: Uint8Array.from([31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42]),
    iterations: 1000,
    hash: "SHA-256",
  };
  const ciphertext = await encryptForTest("raw ciphertext payload", "top-secret", metadata);

  const payload = parseEncryptedPayload(ciphertext.buffer, {
    salt: bytesToBase64(metadata.salt),
    iv: bytesToBase64(metadata.iv),
    iterations: metadata.iterations,
    mimeType: "text/plain",
    fileName: "raw.txt",
  });
  const decrypted = await decryptWithPassword(payload, "top-secret");

  assert.equal(decoder.decode(decrypted), "raw ciphertext payload");
  assert.equal(payload.source, "raw");
});

test("raw ciphertext requires salt and IV metadata", () => {
  assert.throws(
    () => parseEncryptedPayload(encoder.encode("not-json").buffer),
    /Provide salt and IV/,
  );
});
