import { useRef } from "react";
import { deleteToken, useCurrentUser, useTokens } from "../utils/firestore";
import { signInWithGoogle } from "../AuthButtons/AuthButtons";

export function MyTokens() {
  const [currentUser] = useCurrentUser();
  const uid = currentUser?.uid;
  const [tokens] = useTokens(uid);
  const tokenEl = useRef<HTMLInputElement>(null);
  console.log(tokens);
  if (!uid) {
    return (
      <div>
        Please{" "}
        <a href="#" onClick={signInWithGoogle}>
          sign in
        </a>{" "}
        to see your tokens.
      </div>
    );
  }
  return (
    <div>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Origin</th>
            <th>Expires</th>
            <th>Token</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tokens?.map((token) => (
            <tr key={token.id}>
              <td>{token.featureId}</td>
              <td>{token.origin}</td>
              <td>
                {token.expiry && new Date(token.expiry).toLocaleDateString()}
              </td>
              <td>
                {token.token ? (
                  <input
                    className="form-control"
                    value={token.token}
                    readOnly={true}
                    ref={tokenEl}
                  />
                ) : (
                  "Generating token..."
                )}
              </td>

              <td>
                {token.token && (
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      if (tokenEl.current) {
                        tokenEl.current.select();
                        document.execCommand("copy");
                      }
                    }}
                  >
                    Copy
                  </button>
                )}{" "}
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteToken(token.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
