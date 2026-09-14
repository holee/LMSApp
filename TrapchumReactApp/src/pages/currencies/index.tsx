import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CurrencyCounterPage } from "./CurrencyCounterPage";
import { CurrencyDetails } from "./CurrencyDetailsPage";
import { CurrencyList } from "./CurrencyList";
import { CurrencyProvider } from "./CurrencyStore";
import { DailySpotRates } from "./DailySpotRates";
import { SpotRatePage } from "./SpotRatePage";
import { useCurrencyStore } from "./currencyContext";
import "./CurrencyPages.css";

function CurrencyIndexPage() {
  const [activeTab, setActiveTab] = useState<"list" | "rates">("list");

  return (
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
        {activeTab === "list" ? <CurrencyList /> : <DailySpotRates />}
      </div>
    </section>
  );
}

function CurrencyDetailsRoute({ currencyId }: { currencyId: number }) {
  const navigate = useNavigate();
  const { getCurrency, spotRates } = useCurrencyStore();
  const currency = getCurrency(currencyId);

  if (!currency) {
    return <div className="currency-placeholder">Currency not found.</div>;
  }

  return (
    <CurrencyDetails
      currency={currency}
      rates={spotRates}
      onClose={() => navigate("/App/Currencies")}
    />
  );
}

function SpotRateRoute({ currencyId }: { currencyId: number }) {
  const { getCurrency } = useCurrencyStore();
  const currency = getCurrency(currencyId);

  if (!currency) {
    return <div className="currency-placeholder">Currency not found.</div>;
  }

  return <SpotRatePage currency={currency} />;
}

function CurrencyRouter() {
  const normalizedPath = useLocation().pathname.toLowerCase();

  if (normalizedPath === "/app/notes/currencycounter") {
    return <CurrencyCounterPage />;
  }

  const detailsMatch = normalizedPath.match(/^\/account\/currencies\/(\d+)$/);
  if (detailsMatch) {
    return <CurrencyDetailsRoute currencyId={Number(detailsMatch[1])} />;
  }

  const spotMatch = normalizedPath.match(
    /^\/app\/currencies\/spotrate\/(\d+)$/,
  );
  if (spotMatch) {
    return <SpotRateRoute currencyId={Number(spotMatch[1])} />;
  }

  return <CurrencyIndexPage />;
}

function CurrencyToast() {
  const { toast } = useCurrencyStore();

  if (!toast) {
    return null;
  }

  return (
    <div className="currency-toast" role="status">
      {toast}
    </div>
  );
}

export function CurrencyPages() {
  return (
    <CurrencyProvider>
      <CurrencyRouter />
      <CurrencyToast />
    </CurrencyProvider>
  );
}
