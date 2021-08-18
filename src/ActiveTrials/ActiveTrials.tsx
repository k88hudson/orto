import { useFeatures } from "../utils/firestore";

import { Link } from "react-router-dom";
import { Feature } from "../../types/Orto";
import { useState } from "react";
// TODO
const SHOW_NEW_TRIAL_FORM = false;

interface Field {
  key: keyof Feature;
  label: string;
}
const fields: Array<Field> = [
  { key: "id", label: "Feature ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "learnMoreLink", label: "Learn More Link" },
];

function NewTrialForm() {
  const [newFeature, setNewFeature] = useState<Feature>({
    id: "",
    name: "",
    description: "",
    learnMoreLink: "",
    archived: false,
  });
  const updateNewFeature = (values: Partial<Feature>) => {
    setNewFeature({ ...newFeature, ...values });
  };
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        console.log(newFeature);
      }}
    >
      <h3>Add Feature</h3>
      {fields.map(({ key, label }) => (
        <div className="mb-3" key={key}>
          <label className="form-label" htmlFor={`${key}-input`}>
            {label}
          </label>
          <input
            id={`${key}-input`}
            required
            className="form-control"
            value={newFeature[key] as string}
            onChange={(e) => updateNewFeature({ [key]: e.target.value })}
          />
        </div>
      ))}
      <button className="btn btn-primary">Create</button>
    </form>
  );
}

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
      {SHOW_NEW_TRIAL_FORM && <NewTrialForm />}
    </div>
  );
}
