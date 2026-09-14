import { useState, type FormEvent } from "react";
import { customerTextFields, formatFieldLabel } from "./types";
import type { CustomerFormValues } from "./types";

export function CustomerForm({
  title,
  initialValues,
  onClose,
  onSubmit,
}: {
  title: string;
  initialValues: CustomerFormValues;
  onClose: () => void;
  onSubmit: (values: CustomerFormValues) => void;
}) {
  const [model, setModel] = useState<CustomerFormValues>(initialValues);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(model);
  }

  return (
    <section className="customer-page customer-panel">
      <h2>{title}</h2>
      <form onSubmit={submit}>
        <div className="customer-form-grid">
          {customerTextFields.map((field) => (
            <label key={field}>
              {formatFieldLabel(field)}
              <input
                required={field === "fullName"}
                value={model[field]}
                onChange={(event) =>
                  setModel({ ...model, [field]: event.target.value })
                }
              />
            </label>
          ))}
        </div>
        <div className="customer-actions">
          <button className="primary-button" type="submit">
            Save
          </button>
          <button className="secondary-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </section>
  );
}
