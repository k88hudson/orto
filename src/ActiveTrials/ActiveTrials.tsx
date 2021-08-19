import { useFeatures } from "../utils/firestore";
import { Link } from "react-router-dom";

export function ActiveTrials() {
  const [features] = useFeatures();
  return (
    <div>
      <table className="table align-middle">
        <tbody>
          {features?.map((feature) => (
            <tr key={feature.id}>
              <td style={{ width: "33%" }}>
                <strong>{feature.name}</strong>
              </td>
              <td>{feature.description}</td>
              <td>
                <Link className="btn btn-primary" to={`/new/${feature.id}`}>
                  Register
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
