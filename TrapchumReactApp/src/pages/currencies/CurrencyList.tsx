import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionMenu } from "./ActionMenu";
import { CurrencyCreateDialog } from "./CurrencyCreateDialog";
import { useCurrencyStore } from "./currencyContext";
import { formatRate } from "./types";

const pageSize = 10;

export function CurrencyList() {
  const navigate = useNavigate();
  const { currencies, createCurrency } = useCurrencyStore();
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = currencies.filter(
    (currency) =>
      (includeInactive || currency.active) &&
      (!normalizedSearch ||
        currency.code.toLowerCase().includes(normalizedSearch) ||
        currency.name.toLowerCase().includes(normalizedSearch)),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="currency-list-content">
      <div className="currency-toolbar">
        <button
          className="currency-primary"
          type="button"
          onClick={() => setDialogOpen(true)}
        >
          + New Currency
        </button>
        <div className="currency-toolbar-group">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            type="search"
            placeholder="Search currencies"
            aria-label="Search currencies"
          />
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8} className="currency-empty">
                  No currencies match the current filter.
                </td>
              </tr>
            ) : (
              visible.map((currency, index) => (
                <tr key={currency.id}>
                  <td>{(page - 1) * pageSize + index + 1}</td>
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
                  <td className="currency-number">
                    {formatRate(currency.spot)}
                  </td>
                  <td className="currency-number">
                    {formatRate(currency.buying)}
                  </td>
                  <td className="currency-number">
                    {formatRate(currency.selling)}
                  </td>
                  <td>
                    <span
                      className={
                        currency.active
                          ? "currency-status active"
                          : "currency-status inactive"
                      }
                    >
                      {currency.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <ActionMenu
                      items={[
                        {
                          label: "Details",
                          onSelect: () =>
                            navigate(`/Account/Currencies/${currency.id}`),
                        },
                        {
                          label: "Set Spot Rate",
                          onSelect: () =>
                            navigate(`/App/Currencies/SpotRate/${currency.id}`),
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
      {dialogOpen && (
        <CurrencyCreateDialog
          onClose={() => setDialogOpen(false)}
          onSave={(values) => {
            createCurrency(values);
            setDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
