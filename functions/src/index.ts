import * as functions from "firebase-functions";

import { TokenPayload, TokenRequest } from "../../types/Orto";
import { generateToken } from "./generateToken";

const PRIVATE_KEY: string = functions.config().signature.privatekey;

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

    const token = generateToken(payload, PRIVATE_KEY);
    return snapshot.ref.update({ token, expiry });
  });
