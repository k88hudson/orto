import { generateToken } from "./generateToken";
import { generateKeyPairSync, verify } from "crypto";
const STRUCTURE = [[0, 1], [1, 65], [65, 69], [69]];

function getTestKeys(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return { publicKey, privateKey };
}

function getParts(token: string) {
  let buff = Buffer.from(token, "base64");
  return STRUCTURE.map((indexes) => buff.slice(...indexes));
}

test("verify token signature and parts", () => {
  const { publicKey, privateKey } = getTestKeys();
  const testPayload = {
    origin: "https://foo.com",
    feature: "foo",
    expiry: Date.now(),
  };
  const token = generateToken(testPayload, privateKey);
  const [version, signature, length, payload] = getParts(token);
  const parsedPayload = JSON.parse(payload.toString());

  expect(version.readInt8()).toBe(3);
  expect(length.readUInt32BE()).toBe(payload.byteLength);
  expect(parsedPayload).toEqual(testPayload);
  expect(verify(null, payload, publicKey, signature)).toBe(true);
});
