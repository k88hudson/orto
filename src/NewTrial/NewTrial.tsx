import { Feature } from "../../types/Orto";
import { useState } from "react";

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

export function NewTrial() {
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
      <h3>Create a Trial</h3>
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
