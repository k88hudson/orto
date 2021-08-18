import * as functions from "firebase-functions";
import crypto = require("crypto");
import { TokenPayload, TokenRequest } from "../../types/Orto";

const PRIVATE_KEY: string = functions.config().signature.privatekey;
const TOKEN_VERSION = 3;

function generateSignature(payload: TokenPayload) {
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  return crypto.sign(null, payloadBuffer, PRIVATE_KEY);
}

function createToken(payload: TokenPayload) {
  const version = Buffer.from([TOKEN_VERSION]);
  const payloadBuffer = Buffer.from(JSON.stringify(payload));
  const payloadLength = Buffer.allocUnsafe(4);
  payloadLength.writeUInt32BE(payloadBuffer.byteLength, 0);
  const signature = generateSignature(payload);
  return Buffer.concat([
    version,
    signature,
    payloadLength,
    payloadBuffer,
  ]).toString("base64");
}

exports.myFunction = functions.firestore
  .document("tokens/{tokenId}")
  .onCreate(async (snapshot, context) => {
    const tokenData = snapshot.data() as TokenRequest;
    const currentDate = new Date(context.timestamp);
    const expiry: number = currentDate.setDate(currentDate.getDate() + 30);

    const payload: TokenPayload = {
      feature: tokenData.featureId,
      origin: tokenData.origin,
      expiry,
    };

    if (tokenData.isSubdomain) {
      payload.isSubdomain = tokenData.isSubdomain;
    }

    const token = createToken(payload);
    return snapshot.ref.update({ token, expiry });
  });
