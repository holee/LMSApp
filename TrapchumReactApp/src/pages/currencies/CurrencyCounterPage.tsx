import { useState } from "react";
import { ActionMenu } from "./ActionMenu";
import { NoteDialog } from "./NoteDialog";
import { useCurrencyStore } from "./currencyContext";
import { formatCount, formatValue } from "./types";

const pageSize = 10;

export function CurrencyCounterPage() {
  const { currencies, notes, addNote, toggleNote } = useCurrencyStore();
  const [currencyFilter, setCurrencyFilter] = useState(0);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = notes.filter(
    (note) =>
      (currencyFilter === 0 || note.currencyId === currencyFilter) &&
      (includeInactive || note.active),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="currency-page">
      <header className="currency-page-header">
        <span className="currency-page-icon" aria-hidden="true">
          $
        </span>
        <div>
          <h2>Currency Notes</h2>
          <p>Manage physical currency denominations and note counts.</p>
        </div>
      </header>
      <div className="currency-panel">
        <div className="currency-toolbar">
          <div className="currency-toolbar-group">
            <button
              className="currency-primary"
              type="button"
              onClick={() => setDialogOpen(true)}
            >
              + New Note
            </button>
            <select
              value={currencyFilter}
              onChange={(event) => {
                setCurrencyFilter(Number(event.target.value));
                setPage(1);
              }}
              aria-label="Filter by currency"
            >
              <option value={0}>Filter by currency...</option>
              {currencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
          <label className="currency-check">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(event) => {
                setIncludeInactive(event.target.checked);
                setPage(1);
              }}
            />{" "}
            Include Inactive
          </label>
        </div>
        <div className="currency-table-wrap">
          <table className="currency-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Currency Name</th>
                <th>Code</th>
                <th>Value</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="currency-empty">
                    No currency notes match the current filter.
                  </td>
                </tr>
              ) : (
                visible.map((note, index) => (
                  <tr key={note.id}>
                    <td>{(page - 1) * pageSize + index + 1}</td>
                    <td>{note.name}</td>
                    <td>
                      <span className="currency-code">{note.code}</span>
                    </td>
                    <td className="currency-number">
                      {formatValue(note.value)}
                    </td>
                    <td className="currency-number">
                      {formatCount(note.quantity)}
                    </td>
                    <td>{note.description || "—"}</td>
                    <td>
                      <span
                        className={
                          note.active
                            ? "currency-status active"
                            : "currency-status inactive"
                        }
                      >
                        {note.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <ActionMenu
                        items={[
                          {
                            label: note.active ? "Deactivate" : "Activate",
                            onSelect: () => toggleNote(note.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="currency-pager">
          <span>{filtered.length} records</span>
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page === pageCount}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      </div>
      {dialogOpen && (
        <NoteDialog
          currencies={currencies}
          presetCurrencyId={0}
          onClose={() => setDialogOpen(false)}
          onSave={(draft) => {
            addNote(draft);
            setDialogOpen(false);
          }}
        />
      )}
    </section>
  );
}
