import { useState } from "react";
import { customerDetailTabs } from "./data";
import { customerInitials } from "./types";
import type { CustomerRecord } from "./types";

function CustomerTabContent({ tab }: { tab: string }) {
  if (tab === "Income & Expense") {
    return (
      <div className="customer-summary">
        <article>
          <span>Total Income</span>
          <strong>3,250.00</strong>
        </article>
        <article>
          <span>Total Expense</span>
          <strong>1,480.00</strong>
        </article>
        <article>
          <span>Net Profit</span>
          <strong>1,770.00</strong>
        </article>
      </div>
    );
  }

  return (
    <div className="customer-tab-content">
      <div>
        <h3>{tab}</h3>
        <p>Customer {tab.toLowerCase()} records and actions.</p>
      </div>
      <button className="primary-button" type="button">
        Add {tab.replace(/s$/, "")}
      </button>
    </div>
  );
}

export function CustomerDetailsPage({
  customer,
  onClose,
  onEdit,
  onDelete,
}: {
  customer: CustomerRecord;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [tab, setTab] = useState("Loan History");

  return (
    <section className="customer-page">
      <article className="customer-profile">
        <header>
          <span className="customer-avatar">
            {customerInitials(customer.fullName)}
          </span>
          <div>
            <h2>{customer.altName}</h2>
            <p>{customer.fullName}</p>
          </div>
          <span
            className={`customer-status ${customer.loanActive ? "active" : "inactive"}`}
          >
            {customer.loanActive ? "Active Loan" : "No Active Loan"}
          </span>
        </header>
        <dl className="customer-info-grid">
          <div>
            <dt>Phone</dt>
            <dd>{customer.phone}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{customer.email}</dd>
          </div>
          <div>
            <dt>Gender</dt>
            <dd>{customer.gender}</dd>
          </div>
          <div>
            <dt>Marital Status</dt>
            <dd>{customer.maritalStatus}</dd>
          </div>
          <div>
            <dt>ID Card</dt>
            <dd>{customer.idCard}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{customer.address}</dd>
          </div>
        </dl>
        <div className="customer-actions">
          <button className="primary-button" type="button" onClick={onEdit}>
            Edit
          </button>
          <button className="danger-button" type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </article>
      <article className="customer-panel">
        <div className="customer-tabs" role="tablist">
          {customerDetailTabs.map((item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <CustomerTabContent tab={tab} />
      </article>
      <div className="customer-actions">
        <button className="danger-button" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </section>
  );
}
