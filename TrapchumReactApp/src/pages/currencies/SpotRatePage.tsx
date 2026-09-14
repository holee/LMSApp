import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { NoteDialog } from "./NoteDialog";
import { NoteListDialog } from "./NoteListDialog";
import { useCurrencyStore } from "./currencyContext";
import { formatDate, formatRate, todayIso } from "./types";
import type { CurrencyRecord, SpotRateRecord } from "./types";

export function SpotRatePage({ currency }: { currency: CurrencyRecord }) {
  const navigate = useNavigate();
  const { spotRates, notes, setSpotRate, addNote } = useCurrencyStore();
  const [date, setDate] = useState(todayIso);
  const [spot, setSpot] = useState(String(currency.spot));
  const [buying, setBuying] = useState(String(currency.buying));
  const [selling, setSelling] = useState(String(currency.selling));
  const [notesOpen, setNotesOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);

  const history = spotRates.filter((rate) => rate.currencyId === currency.id);
  const currencyNotes = notes.filter((note) => note.currencyId === currency.id);

  function loadRow(rate: SpotRateRecord) {
    setDate(rate.date);
    setSpot(String(rate.spot));
    setBuying(String(rate.buying));
    setSelling(String(rate.selling));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSpotRate(currency.id, {
      date,
      spot: Number(spot || 0),
      buying: Number(buying || 0),
      selling: Number(selling || 0),
    });
  }

  return (
    <section className="currency-page">
      <div className="currency-detail-card">
        <div className="currency-section-heading">
          <b>Currency Information</b>
          <span className="currency-name-cell">
            <span
              className={
                currency.active
                  ? "currency-status active"
                  : "currency-status inactive"
              }
            >
              {currency.active ? "Active" : "Inactive"}
            </span>
            {currency.base && (
              <span className="currency-base-badge">Base Currency</span>
            )}
          </span>
        </div>
        <dl className="currency-details-grid">
          <div>
            <dt>Currency Name</dt>
            <dd>{currency.name}</dd>
          </div>
          <div>
            <dt>Currency Code</dt>
            <dd>{currency.code}</dd>
          </div>
          <div className="currency-badge-stack">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setNotesOpen(true)}
            >
              Currency Notes
            </button>
            <button
              className="currency-primary"
              type="button"
              onClick={() => setAddNoteOpen(true)}
            >
              Add New Note
            </button>
          </div>
        </dl>
      </div>

      {!currency.base && (
        <div className="currency-detail-card">
          <div className="currency-section-heading">
            <b>Exchange Rate</b>
          </div>
          <div className="currency-rate-layout">
            <form className="currency-rate-form" onSubmit={submit}>
              <h3>Select A Date to See Exchange Rate</h3>
              <input
                type="date"
                max={todayIso()}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
              <h3>Spot Rate</h3>
              <span className="currency-rate-group">
                <span>1USD=</span>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={spot}
                  onChange={(event) => setSpot(event.target.value)}
                  placeholder="0.00"
                  required
                />
                <span>KHR</span>
              </span>
              <h3>Buying Rate</h3>
              <span className="currency-rate-group">
                <span>1USD=</span>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={buying}
                  onChange={(event) => setBuying(event.target.value)}
                  placeholder="0.00"
                  required
                />
                <span>KHR</span>
              </span>
              <h3>Selling Rate</h3>
              <span className="currency-rate-group">
                <span>1USD=</span>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={selling}
                  onChange={(event) => setSelling(event.target.value)}
                  placeholder="0.00"
                  required
                />
                <span>KHR</span>
              </span>
              <button className="currency-primary" type="submit">
                Set Spot Rate
              </button>
            </form>
            <div>
              <h3>Rate History</h3>
              <div className="currency-table-wrap">
                <table className="currency-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>As Of Date</th>
                      <th>Spot Rate</th>
                      <th>Buying Rate</th>
                      <th>Selling Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="currency-empty">
                          No rate history recorded.
                        </td>
                      </tr>
                    ) : (
                      history.map((rate, index) => (
                        <tr key={rate.id} onClick={() => loadRow(rate)}>
                          <td>{index + 1}</td>
                          <td>{formatDate(rate.date)}</td>
                          <td className="currency-number">
                            {formatRate(rate.spot)}
                          </td>
                          <td className="currency-number">
                            {formatRate(rate.buying)}
                          </td>
                          <td className="currency-number">
                            {formatRate(rate.selling)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="currency-action-bar">
        <button
          className="secondary-button"
          type="button"
          onClick={() => navigate("/App/Currencies")}
        >
          Back
        </button>
      </div>

      {notesOpen && (
        <NoteListDialog
          notes={currencyNotes}
          onClose={() => setNotesOpen(false)}
        />
      )}
      {addNoteOpen && (
        <NoteDialog
          currencies={[currency]}
          presetCurrencyId={currency.id}
          onClose={() => setAddNoteOpen(false)}
          onSave={(draft) => {
            addNote(draft);
            setAddNoteOpen(false);
          }}
        />
      )}
    </section>
  );
}
