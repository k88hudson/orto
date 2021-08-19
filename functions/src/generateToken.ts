import { TokenPayload } from "../../types/Orto";
import { sign } from "crypto";
const TOKEN_VERSION = 3;

export function generateSignature(payload: TokenPayload, privateKey: string) {
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  return sign(null, payloadBuffer, privateKey);
}
// Returns a base64-encoded signed token, including a stringified json payload and signature.
// See https://github.com/chromium/chromium/blob/d7da0240cae77824d1eda25745c4022757499131/third_party/blink/public/common/origin_trials/origin_trials_token_structure.md
export function generateToken(payload: TokenPayload, privateKey: string) {
  // Token version number (1 byte)
  const version = Buffer.from([TOKEN_VERSION]);

  // Signature (64 bytes)
  const signature = generateSignature(payload, privateKey);

  // Payload (TokenPayload)
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  const payloadLength = Buffer.allocUnsafe(4);
  payloadLength.writeUInt32BE(payloadBuffer.byteLength, 0);

  return Buffer.concat([
    version,
    signature,
    payloadLength,
    payloadBuffer,
  ]).toString("base64");
}
