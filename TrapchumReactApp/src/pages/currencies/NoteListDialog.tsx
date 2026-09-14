import { formatCount, formatValue } from "./types";
import type { NoteRecord } from "./types";

export function NoteListDialog({
  notes,
  onClose,
}: {
  notes: NoteRecord[];
  onClose: () => void;
}) {
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
        aria-labelledby="note-list-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <h3 id="note-list-title">Currency Notes</h3>
            <p>Denominations recorded for this currency.</p>
          </div>
          <button type="button" aria-label="Close dialog" onClick={onClose}>
            &#10005;
          </button>
        </header>
        <div className="currency-table-wrap">
          <table className="currency-table">
            <thead>
              <tr>
                <th>Currency Name</th>
                <th>Currency Code</th>
                <th>Currency Value</th>
                <th>Quantity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {notes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="currency-empty">
                    No currency notes recorded.
                  </td>
                </tr>
              ) : (
                notes.map((note) => (
                  <tr key={note.id}>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
