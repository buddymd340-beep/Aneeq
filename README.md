# Aneeq

A small client-side encrypted file viewer. Upload an encrypted file, enter its
password, and preview the decrypted result directly in the browser.

## Run locally

No dependencies are required. Serve the folder with any static web server:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Test

```sh
npm test
```

## Supported encrypted file format

For automatic decryption, upload a UTF-8 JSON file with this structure:

```json
{
  "version": 1,
  "algorithm": "AES-GCM",
  "kdf": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 210000,
  "salt": "base64-salt",
  "iv": "base64-iv",
  "ciphertext": "base64-ciphertext-with-gcm-tag",
  "mimeType": "text/plain",
  "fileName": "document.txt"
}
```

The viewer also supports raw AES-GCM ciphertext if you provide the salt, IV,
PBKDF2 iteration count, MIME type, and output filename in the advanced options.
