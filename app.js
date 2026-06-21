(function () {
  "use strict";

  const DEFAULT_ITERATIONS = 210000;
  const DEFAULT_HASH = "SHA-256";
  const DEFAULT_MIME_TYPE = "application/octet-stream";

  const textDecoder = new TextDecoder();
  const textEncoder = new TextEncoder();

  function base64ToBytes(value) {
    if (!value || typeof value !== "string") {
      throw new Error("Expected a base64 string.");
    }

    const normalized = value
      .replace(/^data:[^,]+,/, "")
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .replace(/\s+/g, "");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    if (typeof atob === "function") {
      const binary = atob(padded);
      return Uint8Array.from(binary, (character) => character.charCodeAt(0));
    }

    if (typeof Buffer !== "undefined") {
      return Uint8Array.from(Buffer.from(padded, "base64"));
    }

    throw new Error("This environment cannot decode base64 values.");
  }

  function bytesToBase64(bytes) {
    if (typeof btoa === "function") {
      let binary = "";
      for (const byte of bytes) {
        binary += String.fromCharCode(byte);
      }
      return btoa(binary);
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(bytes).toString("base64");
    }

    throw new Error("This environment cannot encode base64 values.");
  }

  function normalizeAlgorithm(value) {
    return String(value || "")
      .replace(/[^a-z0-9]/gi, "")
      .toUpperCase();
  }

  function normalizeHash(value) {
    const hash = String(value || DEFAULT_HASH).toUpperCase();
    return hash.includes("-") ? hash : hash.replace(/^SHA/, "SHA-");
  }

  function parsePositiveInteger(value, fallback, fieldName) {
    const parsed = Number(value || fallback);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new Error(`${fieldName} must be a positive integer.`);
    }
    return parsed;
  }

  function tryParseJsonEnvelope(buffer) {
    const text = textDecoder.decode(buffer).trim();
    if (!text.startsWith("{")) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  function parseJsonEnvelope(envelope, fallbackOptions) {
    const algorithm = normalizeAlgorithm(envelope.algorithm || "AES-GCM");
    if (algorithm !== "AESGCM") {
      throw new Error(`Unsupported algorithm "${envelope.algorithm}". Use AES-GCM.`);
    }

    const kdf = normalizeAlgorithm(envelope.kdf || "PBKDF2");
    if (kdf !== "PBKDF2") {
      throw new Error(`Unsupported KDF "${envelope.kdf}". Use PBKDF2.`);
    }

    const salt = envelope.salt;
    const iv = envelope.iv || envelope.nonce;
    const ciphertext =
      envelope.ciphertext || envelope.cipherText || envelope.data || envelope.payload;

    if (!salt || !iv || !ciphertext) {
      throw new Error("Encrypted JSON must include salt, iv, and ciphertext.");
    }

    return {
      source: "json",
      salt: base64ToBytes(salt),
      iv: base64ToBytes(iv),
      ciphertext: base64ToBytes(ciphertext),
      additionalData: envelope.aad ? base64ToBytes(envelope.aad) : undefined,
      iterations: parsePositiveInteger(
        envelope.iterations,
        DEFAULT_ITERATIONS,
        "PBKDF2 iterations",
      ),
      hash: normalizeHash(envelope.hash),
      mimeType:
        envelope.mimeType ||
        envelope.contentType ||
        envelope.type ||
        fallbackOptions.mimeType ||
        DEFAULT_MIME_TYPE,
      fileName:
        envelope.fileName ||
        envelope.filename ||
        envelope.name ||
        fallbackOptions.fileName ||
        "decrypted-file",
    };
  }

  function parseRawPayload(buffer, options) {
    if (!options.salt || !options.iv) {
      throw new Error(
        "This does not look like a JSON envelope. Provide salt and IV in advanced options for raw files.",
      );
    }

    const ciphertext = options.ciphertextBase64
      ? base64ToBytes(textDecoder.decode(buffer))
      : new Uint8Array(buffer);

    return {
      source: "raw",
      salt: base64ToBytes(options.salt),
      iv: base64ToBytes(options.iv),
      ciphertext,
      iterations: parsePositiveInteger(
        options.iterations,
        DEFAULT_ITERATIONS,
        "PBKDF2 iterations",
      ),
      hash: normalizeHash(options.hash),
      mimeType: options.mimeType || DEFAULT_MIME_TYPE,
      fileName: options.fileName || "decrypted-file",
    };
  }

  function parseEncryptedPayload(buffer, options = {}) {
    const envelope = tryParseJsonEnvelope(buffer);
    if (envelope) {
      return parseJsonEnvelope(envelope, options);
    }
    return parseRawPayload(buffer, options);
  }

  async function deriveAesGcmKey(password, payload) {
    if (!globalThis.crypto || !globalThis.crypto.subtle) {
      throw new Error("Web Crypto is not available in this environment.");
    }

    const baseKey = await globalThis.crypto.subtle.importKey(
      "raw",
      textEncoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    return globalThis.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: payload.salt,
        iterations: payload.iterations,
        hash: payload.hash,
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );
  }

  async function decryptWithPassword(payload, password) {
    if (!password) {
      throw new Error("Enter a password to decrypt the file.");
    }

    const key = await deriveAesGcmKey(password, payload);
    const decryptOptions = {
      name: "AES-GCM",
      iv: payload.iv,
    };

    if (payload.additionalData) {
      decryptOptions.additionalData = payload.additionalData;
    }

    try {
      const plaintext = await globalThis.crypto.subtle.decrypt(
        decryptOptions,
        key,
        payload.ciphertext,
      );
      return new Uint8Array(plaintext);
    } catch (error) {
      throw new Error("Unable to decrypt. Check the password and encryption metadata.");
    }
  }

  function isTextMimeType(mimeType) {
    return (
      mimeType.startsWith("text/") ||
      [
        "application/json",
        "application/javascript",
        "application/xml",
        "application/x-yaml",
        "image/svg+xml",
      ].includes(mimeType)
    );
  }

  function prettyText(bytes, mimeType) {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    if (mimeType === "application/json") {
      return JSON.stringify(JSON.parse(text), null, 2);
    }
    return text;
  }

  function createPreviewNode(bytes, blobUrl, mimeType) {
    if (mimeType.startsWith("image/")) {
      const image = document.createElement("img");
      image.alt = "Decrypted file preview";
      image.src = blobUrl;
      return image;
    }

    if (mimeType === "application/pdf") {
      const frame = document.createElement("iframe");
      frame.title = "Decrypted PDF preview";
      frame.src = blobUrl;
      return frame;
    }

    if (mimeType.startsWith("video/")) {
      const video = document.createElement("video");
      video.controls = true;
      video.src = blobUrl;
      return video;
    }

    if (mimeType.startsWith("audio/")) {
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = blobUrl;
      return audio;
    }

    if (isTextMimeType(mimeType)) {
      const pre = document.createElement("pre");
      pre.textContent = prettyText(bytes, mimeType);
      return pre;
    }

    const message = document.createElement("div");
    message.className = "preview empty";
    message.textContent =
      "Preview is not available for this file type. Use the download button to save the decrypted file.";
    return message;
  }

  function initializeApp() {
    const form = document.getElementById("decrypt-form");
    const fileInput = document.getElementById("encrypted-file");
    const passwordInput = document.getElementById("password");
    const saltInput = document.getElementById("salt");
    const ivInput = document.getElementById("iv");
    const iterationsInput = document.getElementById("iterations");
    const mimeTypeInput = document.getElementById("mime-type");
    const fileNameInput = document.getElementById("file-name");
    const ciphertextBase64Input = document.getElementById("ciphertext-base64");
    const status = document.getElementById("status");
    const preview = document.getElementById("preview");
    const previewTitle = document.getElementById("preview-title");
    const downloadLink = document.getElementById("download-link");
    let currentBlobUrl;

    function setStatus(message, type = "") {
      status.textContent = message;
      status.className = `status ${type}`.trim();
    }

    function revokeCurrentBlobUrl() {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = undefined;
      }
    }

    function resetPreview(message) {
      revokeCurrentBlobUrl();
      preview.className = "preview empty";
      preview.textContent = message;
      previewTitle.textContent = "No decrypted file yet";
      downloadLink.classList.add("hidden");
      downloadLink.removeAttribute("href");
      downloadLink.removeAttribute("download");
    }

    function renderDecryptedFile(bytes, metadata) {
      revokeCurrentBlobUrl();
      const mimeType = metadata.mimeType || DEFAULT_MIME_TYPE;
      const blob = new Blob([bytes], { type: mimeType });
      currentBlobUrl = URL.createObjectURL(blob);

      downloadLink.href = currentBlobUrl;
      downloadLink.download = metadata.fileName || "decrypted-file";
      downloadLink.classList.remove("hidden");

      preview.replaceChildren(createPreviewNode(bytes, currentBlobUrl, mimeType));
      preview.className = "preview";
      previewTitle.textContent = metadata.fileName || "Decrypted file";
    }

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        resetPreview(`Ready to decrypt ${fileInput.files[0].name}.`);
        setStatus("");
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const file = fileInput.files[0];
      if (!file) {
        setStatus("Choose an encrypted file first.", "error");
        return;
      }

      setStatus("Decrypting...");
      resetPreview("Decrypting file...");

      try {
        const buffer = await file.arrayBuffer();
        const payload = parseEncryptedPayload(buffer, {
          salt: saltInput.value.trim(),
          iv: ivInput.value.trim(),
          iterations: iterationsInput.value,
          mimeType: mimeTypeInput.value.trim(),
          fileName: fileNameInput.value.trim(),
          ciphertextBase64: ciphertextBase64Input.checked,
        });
        const decryptedBytes = await decryptWithPassword(
          payload,
          passwordInput.value,
        );
        renderDecryptedFile(decryptedBytes, payload);
        setStatus("File decrypted successfully.", "success");
      } catch (error) {
        resetPreview("The decrypted file could not be displayed.");
        setStatus(error.message, "error");
      }
    });
  }

  if (typeof document !== "undefined") {
    initializeApp();
  }

  const exported = {
    base64ToBytes,
    bytesToBase64,
    decryptWithPassword,
    parseEncryptedPayload,
    parseJsonEnvelope,
    parseRawPayload,
  };

  if (typeof module !== "undefined") {
    module.exports = exported;
  }

  globalThis.DecryptViewer = exported;
})();
