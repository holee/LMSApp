import { useState } from "react";
import { useCurrencyStore } from "./currencyContext";
import { todayIso } from "./types";

export function DailySpotRates() {
  const { currencies, saveDailySpotRates } = useCurrencyStore();
  const [rateDate, setRateDate] = useState(todayIso);
  const [maxDate] = useState(todayIso);
  const [draft, setDraft] = useState<
    Record<number, { spot: string; buying: string; selling: string }>
  >(() =>
    Object.fromEntries(
      currencies.map((currency) => [
        currency.id,
        {
          spot: String(currency.spot),
          buying: String(currency.buying),
          selling: String(currency.selling),
        },
      ]),
    ),
  );

  function updateRate(
    id: number,
    field: "spot" | "buying" | "selling",
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      [id]: { ...current[id], [field]: value },
    }));
  }

  function save() {
    const rates: Record<
      number,
      { spot: number; buying: number; selling: number }
    > = {};
    for (const currency of currencies) {
      if (currency.base) continue;
      const row = draft[currency.id];
      rates[currency.id] = {
        spot: Number(row?.spot || 0),
        buying: Number(row?.buying || 0),
        selling: Number(row?.selling || 0),
      };
    }
    saveDailySpotRates(rateDate, rates);
  }

  return (
    <section
      className="currency-rate-editor"
      aria-labelledby="daily-rate-title"
    >
      <div className="currency-section-heading">
        <div>
          <h3 id="daily-rate-title">Daily Spot Rate</h3>
          <p>
            Set the exchange rates for all currencies for the selected date.
          </p>
        </div>
        <div className="currency-toolbar-group">
          <label className="currency-date">
            Rate Date
            <input
              type="date"
              max={maxDate}
              value={rateDate}
              onChange={(event) => setRateDate(event.target.value)}
            />
          </label>
          <a
            className="currency-nbc-link"
            href="https://www.nbc.gov.kh/english/economic_research/exchange_rate.php"
            target="_blank"
            rel="noreferrer"
          >
            NBC Exchange Rate &#8599;
          </a>
        </div>
      </div>
      <div className="currency-table-wrap">
        <table className="currency-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Currency Name</th>
              <th>Code</th>
              <th>Spot Rate</th>
              <th>Buying Rate</th>
              <th>Selling Rate</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((currency, index) => (
              <tr
                key={currency.id}
                className={currency.base ? "currency-base-row" : undefined}
              >
                <td>{index + 1}</td>
                <td>
                  <span className="currency-name-cell">
                    {currency.name}
                    {currency.base && (
                      <span className="currency-base-badge">Base</span>
                    )}
                  </span>
                </td>
                <td>
                  <span className="currency-code">{currency.code}</span>
                </td>
                {(["spot", "buying", "selling"] as const).map((field) => (
                  <td key={field}>
                    <input
                      className="currency-rate-input"
                      aria-label={`${currency.code} ${field} rate`}
                      type="number"
                      min="0"
                      step="0.0001"
                      disabled={currency.base}
                      value={draft[currency.id]?.[field] ?? ""}
                      onChange={(event) =>
                        updateRate(currency.id, field, event.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="currency-action-bar">
        <span className="currency-action-hint">
          Rates marked <strong>Base</strong> are locked and cannot be edited.
        </span>
        <button className="currency-primary" type="button" onClick={save}>
          Save Spot Rates
        </button>
      </div>
    </section>
  );
}
