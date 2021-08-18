import firebase from "firebase/app";
import { auth } from "../utils/firestore";

export function signInWithGoogle(e: React.SyntheticEvent) {
  e.preventDefault();
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch((e) => {
    console.log(e);
  });
}

export function SignIn() {
  return (
    <button className="btn btn-primary" onClick={signInWithGoogle}>
      Sign In
    </button>
  );
}

export function SignOut() {
  return (
    <button
      className="btn btn-outline-secondary"
      onClick={(e) => {
        e.preventDefault();
        auth.signOut();
      }}
    >
      Sign out
    </button>
  );
}
