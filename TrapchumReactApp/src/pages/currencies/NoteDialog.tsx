import { useState, type FormEvent } from "react";
import type { CurrencyRecord, NoteFormValues } from "./types";

export function NoteDialog({
  currencies,
  presetCurrencyId,
  onClose,
  onSave,
}: {
  currencies: CurrencyRecord[];
  presetCurrencyId: number;
  onClose: () => void;
  onSave: (draft: NoteFormValues) => void;
}) {
  const [currencyId, setCurrencyId] = useState(presetCurrencyId);
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selected = currencies.find((currency) => currency.id === currencyId);
    if (!selected) return;
    onSave({
      currencyId,
      code: selected.code,
      name: selected.name,
      value: Number(value || 0),
      description: description.trim(),
    });
  }

  return (
    <div
      className="currency-dialog-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="currency-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={submit}>
          <header>
            <div>
              <h3 id="note-dialog-title">Currency note</h3>
              <p>Capture value details with a clean and consistent form.</p>
            </div>
            <button type="button" aria-label="Close dialog" onClick={onClose}>
              &#10005;
            </button>
          </header>
          <div className="currency-form-grid currency-form-single">
            <label>
              Currency Code
              <select
                value={currencyId}
                disabled={presetCurrencyId !== 0}
                onChange={(event) => setCurrencyId(Number(event.target.value))}
                required
              >
                <option value={0}>Select currency</option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Currency Value
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                required
                min="0"
                step="1"
                type="number"
                placeholder="Currency Value"
              />
            </label>
            <label className="currency-form-full">
              Description
              <textarea
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional note about this value"
              />
            </label>
          </div>
          <footer>
            <button type="button" onClick={onClose}>
              Close
            </button>
            <button className="currency-primary" type="submit">
              Save
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
