import { generateToken } from "./generateToken";
import { generateKeyPairSync, verify } from "crypto";
const CHROME_TOKEN =
  "Aj+8ayHOoPdwyxMgiJdqXk6FhK50Vmc9bKwpmcr1gxUX4lsOJt21WKzhrKeaLzZwgymTXIIXN2FOX11mEwJtewEAAABleyJvcmlnaW4iOiJodHRwczovL2J1Z3p5Lm9yZzo0NDMiLCJmZWF0dXJlIjoiQ29tcHV0ZVByZXNzdXJlIiwiZXhwaXJ5IjoxNjM0MDgzMTk5LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=";

function getTestKeys(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return { publicKey, privateKey };
}

function getParts(token: string) {
  let buff = Buffer.from(token, "base64");
  return [[0, 1], [1, 65], [65, 69], [69]].map((indexes) =>
    buff.slice(...indexes)
  );
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

test("tokens should be the same structure as Chrome", () => {
  const [version, signature, length, payload] = getParts(CHROME_TOKEN);
  const parsedPayload = JSON.parse(payload.toString());
  const { publicKey } = getTestKeys();

  expect([2, 3]).toContain(version.readInt8());
  expect(length.readUInt32BE()).toBe(payload.byteLength);
  expect(parsedPayload).toHaveProperty("origin");
  expect(parsedPayload).toHaveProperty("expiry");
  expect(parsedPayload).toHaveProperty("feature");
  expect(verify(null, payload, publicKey, signature)).toBe(false);
});
