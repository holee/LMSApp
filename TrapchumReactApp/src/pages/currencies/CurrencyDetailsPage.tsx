import { useState } from "react";
import { formatDate, formatRate } from "./types";
import type { CurrencyRecord, SpotRateRecord } from "./types";

const pageSize = 5;

export function CurrencyDetails({
  currency,
  rates,
  onClose,
}: {
  currency: CurrencyRecord;
  rates: SpotRateRecord[];
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const history = rates.filter((rate) => rate.currencyId === currency.id);
  const pageCount = Math.max(1, Math.ceil(history.length / pageSize));
  const visible = history.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="currency-page">
      <div className="currency-detail-card">
        <div className="currency-section-heading">
          <span className="currency-page-header">
            <span className="currency-page-icon" aria-hidden="true">
              $
            </span>
            <span>
              <h2>ព័ត៌មានរូបិយប័ណ្ណ</h2>
              <p>Currency Details</p>
            </span>
          </span>
          <button className="currency-danger" type="button" onClick={onClose}>
            បិទ
          </button>
        </div>
        <dl className="currency-details-grid">
          <div>
            <dt>ឈ្មោះរូបិយប័ណ្ណ</dt>
            <dd>{currency.name}</dd>
          </div>
          <div>
            <dt>កូដរូបិយប័ណ្ណ</dt>
            <dd>{currency.code}</dd>
          </div>
          <div className="currency-badge-stack">
            <span
              className={
                currency.active
                  ? "currency-status active"
                  : "currency-status inactive"
              }
            >
              {currency.active ? "រូបិយប័ណ្ណសកម្ម" : "រូបិយប័ណ្ណមិនសកម្ម"}
            </span>
            <span
              className={
                currency.base ? "currency-base-badge" : "currency-sub-badge"
              }
            >
              {currency.base ? "រូបិយប័ណ្ណមូលដ្ឋាន" : "រូបិយប័ណ្ណរង"}
            </span>
          </div>
        </dl>
      </div>

      <div className="currency-detail-card">
        {currency.base ? (
          <div className="currency-alert" role="status">
            រូបិយប័ណ្ណមូលដ្ឋានមិនបង្ហាញតារាងអត្រាប្តូរប្រាក់។
          </div>
        ) : (
          <>
            <div className="currency-section-heading">
              <b>ប្រវត្តិអត្រាប្តូរប្រាក់</b>
              <div className="currency-pager">
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
            <div className="currency-table-wrap">
              <table className="currency-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>កាលបរិច្ឆេទ</th>
                    <th>អត្រាស្ពត</th>
                    <th>អត្រាទិញ</th>
                    <th>អត្រាលក់</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="currency-empty">
                        មិនមានទិន្នន័យអត្រាប្តូរប្រាក់
                      </td>
                    </tr>
                  ) : (
                    visible.map((rate, index) => (
                      <tr
                        key={rate.id}
                        className={
                          selectedId === rate.id
                            ? "currency-selected-row"
                            : undefined
                        }
                        onClick={() => setSelectedId(rate.id)}
                      >
                        <td>{(page - 1) * pageSize + index + 1}</td>
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
          </>
        )}
      </div>
    </section>
  );
}
