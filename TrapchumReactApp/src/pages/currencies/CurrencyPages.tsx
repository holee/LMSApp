import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CurrencyPages.css";

type SpotRateRecord = {
  id: number;
  currencyId: number;
  date: string;
  spot: number;
  buying: number;
  selling: number;
};
type NoteRecord = {
  id: number;
  currencyId: number;
  code: string;
  name: string;
  value: number;
  quantity: number;
  description: string;
  active: boolean;
};

const sampleCurrencies = [
  {
    id: 1,
    code: "KHR",
    name: "Cambodian Riel",
    spot: 1,
    buying: 1,
    selling: 1,
    limit: 50000000,
    base: true,
    active: true,
  },
  {
    id: 2,
    code: "USD",
    name: "US Dollar",
    spot: 4100,
    buying: 4080,
    selling: 4120,
    limit: 100000,
    base: false,
    active: true,
  },
  {
    id: 3,
    code: "THB",
    name: "Thai Baht",
    spot: 118.4,
    buying: 117.8,
    selling: 119.2,
    limit: 2000000,
    base: false,
    active: true,
  },
  {
    id: 4,
    code: "EUR",
    name: "Euro",
    spot: 4462.5,
    buying: 4420,
    selling: 4505,
    limit: 50000,
    base: false,
    active: true,
  },
  {
    id: 5,
    code: "CNY",
    name: "Chinese Yuan",
    spot: 568.2,
    buying: 562,
    selling: 574,
    limit: 500000,
    base: false,
    active: false,
  },
];

const initialSpotRates: SpotRateRecord[] = [
  {
    id: 1,
    currencyId: 2,
    date: "2026-09-08",
    spot: 4100,
    buying: 4080,
    selling: 4120,
  },
  {
    id: 2,
    currencyId: 2,
    date: "2026-09-05",
    spot: 4095,
    buying: 4075,
    selling: 4115,
  },
  {
    id: 3,
    currencyId: 2,
    date: "2026-09-01",
    spot: 4090,
    buying: 4072,
    selling: 4110,
  },
  {
    id: 4,
    currencyId: 3,
    date: "2026-09-08",
    spot: 118.4,
    buying: 117.8,
    selling: 119.2,
  },
  {
    id: 5,
    currencyId: 4,
    date: "2026-09-08",
    spot: 4462.5,
    buying: 4420,
    selling: 4505,
  },
  {
    id: 6,
    currencyId: 5,
    date: "2026-08-28",
    spot: 568.2,
    buying: 562,
    selling: 574,
  },
];

const initialNotes: NoteRecord[] = [
  {
    id: 1,
    currencyId: 1,
    code: "KHR",
    name: "Cambodian Riel",
    value: 100,
    quantity: 420,
    description: "2014 series",
    active: true,
  },
  {
    id: 2,
    currencyId: 1,
    code: "KHR",
    name: "Cambodian Riel",
    value: 500,
    quantity: 310,
    description: "2014 series",
    active: true,
  },
  {
    id: 3,
    currencyId: 2,
    code: "USD",
    name: "US Dollar",
    value: 1,
    quantity: 850,
    description: "Federal Reserve notes",
    active: true,
  },
  {
    id: 4,
    currencyId: 2,
    code: "USD",
    name: "US Dollar",
    value: 20,
    quantity: 140,
    description: "",
    active: false,
  },
];

function formatRate(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function formatValue(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCount(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function ActionMenu({
  items,
}: {
  items: { label: string; onSelect: () => void }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="currency-menu">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        &#8942;
      </button>
      {open && (
        <div className="currency-menu-pop" role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CurrencyPages() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"list" | "rates">("list");
  const [currencies, setCurrencies] = useState(sampleCurrencies);
  const [spotRates, setSpotRates] = useState(initialSpotRates);
  const [notes, setNotes] = useState(initialNotes);
  const [toast, setToast] = useState<string | null>(null);

  const path = location.pathname.toLowerCase();
  const detailsMatch = path.match(/^\/account\/currencies\/(\d+)$/);
  const spotMatch = path.match(/^\/app\/currencies\/spotrate\/(\d+)$/);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function createCurrency(draft: {
    code: string;
    name: string;
    spot: number;
    buying: number;
    selling: number;
    limit: number;
    base: boolean;
  }) {
    setCurrencies((current) => [
      ...current,
      {
        ...draft,
        id: Math.max(0, ...current.map((c) => c.id)) + 1,
        active: true,
      },
    ]);
    notify(`Currency ${draft.code} created`);
  }

  function setSpotRate(
    currencyId: number,
    entry: { date: string; spot: number; buying: number; selling: number },
  ) {
    setSpotRates((current) => [
      ...current,
      {
        ...entry,
        id: Math.max(0, ...current.map((r) => r.id)) + 1,
        currencyId,
      },
    ]);
    setCurrencies((current) =>
      current.map((c) =>
        c.id === currencyId
          ? {
              ...c,
              spot: entry.spot,
              buying: entry.buying,
              selling: entry.selling,
            }
          : c,
      ),
    );
    notify("Spot rate updated");
  }

  function addNote(draft: {
    currencyId: number;
    code: string;
    name: string;
    value: number;
    description: string;
  }) {
    setNotes((current) => [
      ...current,
      {
        ...draft,
        id: Math.max(0, ...current.map((n) => n.id)) + 1,
        quantity: 0,
        active: true,
      },
    ]);
    notify("Currency note added");
  }

  function toggleNote(id: number) {
    setNotes((current) =>
      current.map((note) =>
        note.id === id ? { ...note, active: !note.active } : note,
      ),
    );
    notify("Currency note status updated");
  }

  if (path === "/app/notes/currencycounter") {
    return (
      <>
        <CurrencyCounterPage
          currencies={currencies}
          notes={notes}
          onNewNote={addNote}
          onToggleNote={toggleNote}
        />
        {toast && (
          <div className="currency-toast" role="status">
            {toast}
          </div>
        )}
      </>
    );
  }

  if (detailsMatch) {
    const currency = currencies.find(
      (item) => item.id === Number(detailsMatch[1]),
    );
    return currency ? (
      <CurrencyDetailsPage
        currency={currency}
        rates={spotRates}
        onClose={() => navigate("/App/Currencies")}
      />
    ) : (
      <div className="currency-placeholder">Currency not found.</div>
    );
  }

  if (spotMatch) {
    const currency = currencies.find(
      (item) => item.id === Number(spotMatch[1]),
    );
    return currency ? (
      <>
        <SpotRatePage
          currency={currency}
          rates={spotRates}
          notes={notes.filter((note) => note.currencyId === currency.id)}
          onSetRate={(entry) => setSpotRate(currency.id, entry)}
          onAddNote={(draft) =>
            addNote({
              ...draft,
              currencyId: currency.id,
              code: currency.code,
              name: currency.name,
            })
          }
          onBack={() => navigate("/App/Currencies")}
        />
        {toast && (
          <div className="currency-toast" role="status">
            {toast}
          </div>
        )}
      </>
    ) : (
      <div className="currency-placeholder">Currency not found.</div>
    );
  }

  return (
    <>
      <section className="currency-page">
        <header className="currency-page-header">
          <span className="currency-page-icon" aria-hidden="true">
            $
          </span>
          <div>
            <h2>Currencies</h2>
            <p>Manage currency definitions and exchange rates.</p>
          </div>
        </header>

        <div className="currency-panel">
          <div
            className="currency-tabs"
            role="tablist"
            aria-label="Currency views"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "list"}
              onClick={() => setActiveTab("list")}
            >
              Currencies List
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "rates"}
              onClick={() => setActiveTab("rates")}
            >
              Set Spot Rate
            </button>
          </div>
          {activeTab === "list" ? (
            <CurrencyList
              currencies={currencies}
              onCreate={createCurrency}
              navigate={navigate}
            />
          ) : (
            <DailySpotRates
              currencies={currencies}
              onSave={(date, rates) => {
                setCurrencies((current) =>
                  current.map((c) =>
                    rates[c.id] ? { ...c, ...rates[c.id] } : c,
                  ),
                );
                setSpotRates((current) => {
                  let next = Math.max(0, ...current.map((r) => r.id));
                  const additions = Object.entries(rates).map(([id, rate]) => {
                    next += 1;
                    return { id: next, currencyId: Number(id), date, ...rate };
                  });
                  return [...current, ...additions];
                });
                notify(`Spot rates saved for ${formatDate(date)}`);
              }}
            />
          )}
        </div>
      </section>
      {toast && (
        <div className="currency-toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}

function CurrencyList({
  currencies,
  onCreate,
  navigate,
}: {
  currencies: typeof sampleCurrencies;
  onCreate: (draft: {
    code: string;
    name: string;
    spot: number;
    buying: number;
    selling: number;
    limit: number;
    base: boolean;
  }) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const pageSize = 10;
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

  function createCurrency(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onCreate({
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
    setDialogOpen(false);
  }

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
        <div
          className="currency-dialog-backdrop"
          role="presentation"
          onClick={() => setDialogOpen(false)}
        >
          <div
            className="currency-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="currency-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <form onSubmit={createCurrency}>
              <header>
                <div>
                  <h3 id="currency-dialog-title">Currency details</h3>
                  <p>Define the currency code, exchange rates and limits.</p>
                </div>
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setDialogOpen(false)}
                >
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
                <button type="button" onClick={() => setDialogOpen(false)}>
                  Close
                </button>
                <button className="currency-primary" type="submit">
                  Save
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DailySpotRates({
  currencies,
  onSave,
}: {
  currencies: typeof sampleCurrencies;
  onSave: (
    date: string,
    rates: Record<number, { spot: number; buying: number; selling: number }>,
  ) => void;
}) {
  const [rateDate, setRateDate] = useState(todayIso());
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
    onSave(rateDate, rates);
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
              max={todayIso()}
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

function CurrencyDetailsPage({
  currency,
  rates,
  onClose,
}: {
  currency: (typeof sampleCurrencies)[number];
  rates: SpotRateRecord[];
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
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

function NoteListDialog({
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

function NoteDialog({
  currencies,
  presetCurrencyId,
  onClose,
  onSave,
}: {
  currencies: typeof sampleCurrencies;
  presetCurrencyId: number;
  onClose: () => void;
  onSave: (draft: {
    currencyId: number;
    code: string;
    name: string;
    value: number;
    description: string;
  }) => void;
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

function SpotRatePage({
  currency,
  rates,
  notes,
  onSetRate,
  onAddNote,
  onBack,
}: {
  currency: (typeof sampleCurrencies)[number];
  rates: SpotRateRecord[];
  notes: NoteRecord[];
  onSetRate: (entry: {
    date: string;
    spot: number;
    buying: number;
    selling: number;
  }) => void;
  onAddNote: (draft: { value: number; description: string }) => void;
  onBack: () => void;
}) {
  const history = rates.filter((rate) => rate.currencyId === currency.id);
  const [date, setDate] = useState(todayIso());
  const [spot, setSpot] = useState(String(currency.spot));
  const [buying, setBuying] = useState(String(currency.buying));
  const [selling, setSelling] = useState(String(currency.selling));
  const [notesOpen, setNotesOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);

  function loadRow(rate: SpotRateRecord) {
    setDate(rate.date);
    setSpot(String(rate.spot));
    setBuying(String(rate.buying));
    setSelling(String(rate.selling));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSetRate({
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
        <button className="secondary-button" type="button" onClick={onBack}>
          Back
        </button>
      </div>

      {notesOpen && (
        <NoteListDialog notes={notes} onClose={() => setNotesOpen(false)} />
      )}
      {addNoteOpen && (
        <NoteDialog
          currencies={[currency]}
          presetCurrencyId={currency.id}
          onClose={() => setAddNoteOpen(false)}
          onSave={(draft) => {
            onAddNote({ value: draft.value, description: draft.description });
            setAddNoteOpen(false);
          }}
        />
      )}
    </section>
  );
}

function CurrencyCounterPage({
  currencies,
  notes,
  onNewNote,
  onToggleNote,
}: {
  currencies: typeof sampleCurrencies;
  notes: NoteRecord[];
  onNewNote: (draft: {
    currencyId: number;
    code: string;
    name: string;
    value: number;
    description: string;
  }) => void;
  onToggleNote: (id: number) => void;
}) {
  const [currencyFilter, setCurrencyFilter] = useState(0);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const pageSize = 10;
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
                            onSelect: () => onToggleNote(note.id),
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
            onNewNote(draft);
            setDialogOpen(false);
          }}
        />
      )}
    </section>
  );
}
