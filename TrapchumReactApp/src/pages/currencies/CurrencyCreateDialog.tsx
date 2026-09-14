import { type FormEvent } from "react";
import type { CurrencyFormValues } from "./types";

export function CurrencyCreateDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (values: CurrencyFormValues) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      code: String(form.get("code") ?? "")
        .trim()
        .toUpperCase(),
      name: String(form.get("name") ?? "").trim(),
      spot: Number(form.get("spot")),
      buying: Number(form.get("buying")),
      selling: Number(form.get("selling")),
      limit: Number(form.get("limit")),
      base: form.get("base") === "on",
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
        aria-labelledby="currency-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={submit}>
          <header>
            <div>
              <h3 id="currency-dialog-title">Currency details</h3>
              <p>Define the currency code, exchange rates and limits.</p>
            </div>
            <button type="button" aria-label="Close dialog" onClick={onClose}>
              &#10005;
            </button>
          </header>
          <div className="currency-form-grid">
            <label>
              Currency Code
              <input
                name="code"
                required
                maxLength={3}
                placeholder="Currency code"
              />
            </label>
            <label>
              Currency Name
              <input name="name" required placeholder="Currency name" />
            </label>
            <label>
              Spot Rate
              <input
                name="spot"
                required
                min="0"
                step="0.0001"
                type="number"
                placeholder="Spot rate"
              />
            </label>
            <label>
              Buying Rate
              <input
                name="buying"
                required
                min="0"
                step="0.0001"
                type="number"
                placeholder="Buying rate"
              />
            </label>
            <label>
              Selling Rate
              <input
                name="selling"
                required
                min="0"
                step="0.0001"
                type="number"
                placeholder="Selling rate"
              />
            </label>
            <label>
              Limit
              <input
                name="limit"
                required
                min="0"
                step="1"
                type="number"
                placeholder="Limit"
              />
            </label>
            <label className="currency-check">
              <input name="base" type="checkbox" /> Is Base Currency
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
