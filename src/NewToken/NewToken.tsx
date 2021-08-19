import React, { useRef, useState } from "react";
import { addToken, useCurrentUser, useFeature } from "../utils/firestore";
import { TokenRequest } from "../../types/Orto";
import { useParams, useHistory } from "react-router-dom";
import { signInWithGoogle } from "../AuthButtons/AuthButtons";

const TERMS = [
  "I understand that this feature is experimental and may at any point become unavailable, and may never be enabled beyond this experiment, and even if Firefox decides to enable the feature after this trial, it will be unavailable for some time.",
  "I understand that this feature may change throughout the course of the trial.",
  "Where possible, I agree to apply feature detection / graceful degradation to handle the case where the experimental feature is unavailable.",
];

function validateUrl(candidate: string) {
  let url: URL;
  try {
    url = new URL(candidate);
  } catch (e) {
    return false;
  }
  if (!["http:", "https:"].includes(url.protocol)) return false;
  return true;
}

export function NewToken() {
  const [currentUser] = useCurrentUser();
  const uid = currentUser?.uid;
  const history = useHistory();
  const { featureId } = useParams<{ featureId: string }>();
  const originRef = useRef<HTMLInputElement>(null);
  const [newToken, setNewToken] = useState<
    Omit<TokenRequest, "uid" | "featureId">
  >({
    origin: "",
    isSubdomain: false,
  });

  const feature = useFeature(featureId);
  const onFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const { origin, isSubdomain } = newToken;
    if (!uid || !origin || !featureId) {
      return;
    }

    const ref = await addToken({
      uid: uid,
      origin,
      featureId,
      isSubdomain,
    });
    console.log(ref.id);
    history.push("/my");
  };
  if (!feature) {
    return <div>Loading...</div>;
  }
  if (!uid) {
    return (
      <div>
        Please{" "}
        <a href="#" onClick={signInWithGoogle}>
          sign in
        </a>{" "}
        to create a token.
      </div>
    );
  }
  return (
    <div className="row">
      <form onSubmit={onFormSubmit} className="col-lg-8">
        <h2 className="mb-2">Create token for {feature.name}</h2>
        <p className="mb-4">
          {feature.description}
          {feature.learnMoreLink && (
            <>
              <br />
              <a href={feature.learnMoreLink} target="_blank" rel="noreferrer">
                Learn More
              </a>
            </>
          )}
        </p>

        <div className="mb-3">
          <label className="form-label" htmlFor="origin-input">
            Web Origin
          </label>
          <input
            id="origin-input"
            required
            className="form-control"
            placeholder="https://foo.com"
            ref={originRef}
            value={newToken.origin}
            onChange={(e) => {
              setNewToken({ ...newToken, origin: e.target.value });
              if (e.target.value && validateUrl(e.target.value)) {
                originRef.current?.setCustomValidity("");
              } else {
                originRef.current?.setCustomValidity(
                  "Origin must be a valid url starting with http or https"
                );
              }
            }}
          />
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isSubdomain-input"
              checked={newToken.isSubdomain}
              onChange={(e) =>
                setNewToken({ ...newToken, isSubdomain: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="isSubdomain-input">
              I need a token to match all subdomains of the origin.
            </label>
          </div>
        </div>

        <div className="alert alert-warning mb-4">
          <p>Terms and conditions</p>
          {TERMS.map((term, i) => (
            <div key={i} className="form-check">
              <input
                id={`term-${i}`}
                type="checkbox"
                required
                className="form-check-input"
              />
              <label htmlFor={`term-${i}`} className="form-check-label">
                {term}
              </label>
            </div>
          ))}
        </div>
        <div className="mb-3">
          <button className="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  );
}
