import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useEffect, useState } from "react";
import { Token, TokenRequest, Feature } from "../../types/Orto";

export function initialize() {
  if (!firebase.apps.length) {
    console.log("INIT FIRESTORE");
    firebase.initializeApp({
      apiKey: "AIzaSyD9yol-9NCX10hRb33MjRxLW1I2BnCatPU",
      authDomain: "orto-408ca.firebaseapp.com",
      projectId: "orto-408ca",
      storageBucket: "orto-408ca.appspot.com",
      messagingSenderId: "938595199529",
      appId: "1:938595199529:web:2861c65a221c3dec7a8a38",
    });
  } else {
    firebase.app();
  }
}

// We have to initialize before any other files use firebase.
initialize();

const typedConverter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => {
    return {
      ...(snap.data() as T),
      id: snap.id,
    } as T;
  },
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const db = {
  tokens: firestore.collection("tokens").withConverter(typedConverter<Token>()),
  features: firestore
    .collection("features")
    .withConverter(typedConverter<Feature>()),
};

export function useTokens(uid?: string) {
  const [tokens, setTokens] = useState<Array<Token>>([]);
  useEffect(() => {
    if (uid) {
      const unsubscribe = db.tokens
        .where("uid", "==", uid)
        .onSnapshot((qSnapshot) => {
          if (!qSnapshot.size) {
            setTokens([]);
            return;
          }
          const updatedTokens: Array<Token> = [];
          qSnapshot.forEach((doc) => {
            const data = doc.data();
            updatedTokens.push(data);
          });
          setTokens(updatedTokens);
        });
      return unsubscribe;
    }
  }, [uid]);
  return [tokens];
}

export function addToken(token: TokenRequest) {
  const request = {
    ...token,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  return (
    db.tokens
      // id is added automatically
      .add(request as Token)
  );
}

export function deleteToken(tokenId: string) {
  db.tokens
    .doc(tokenId)
    .delete()
    .then((value) => {
      console.log(value);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function useFeatures() {
  const [features, setFeatures] = useState<Array<Feature>>([]);
  useEffect(() => {
    db.features
      .where("archived", "!=", true)
      .get()
      .then((qSnapshot) => {
        const features: Array<Feature> = [];
        qSnapshot.forEach((doc) => features.push(doc.data()));
        setFeatures(features);
      })
      .catch((error) => console.log(error));
  }, []);
  return [features];
}

export function useFeature(featureId: string) {
  const [feature, setFeature] = useState<Feature>();
  useEffect(() => {
    return db.features.doc(featureId).onSnapshot((doc) => {
      setFeature(doc.data());
    });
  }, []);
  return feature;
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);
  return [currentUser];
}
