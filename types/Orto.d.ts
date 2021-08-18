import firebase from "firebase/app";

export interface Token {
  id: string;
  uid: string;
  origin: string;
  featureId: string;
  isSubdomain: boolean;
  createdAt: firebase.firestore.Timestamp;
  token?: string;
  expiry?: number;
}

export type TokenRequest = Omit<Token, "token" | "id" | "createdAt" | "expiry">;

export interface Feature {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  learnMoreLink?: string;
}

export interface TokenPayload {
  feature: string;
  origin: string;
  expiry: number;
  isSubdomain?: boolean;
}
