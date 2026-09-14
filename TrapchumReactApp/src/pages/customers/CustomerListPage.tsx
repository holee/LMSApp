import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerStore } from "./customerContext";

export function CustomerListPage() {
  const navigate = useNavigate();
  const { customers } = useCustomerStore();
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);

  const normalizedSearch = search.toLowerCase();
  const filtered = customers.filter((customer) => {
    const text =
      `${customer.altName} ${customer.fullName} ${customer.phone} ${customer.email}`.toLowerCase();
    return (
      text.includes(normalizedSearch) && (includeInactive || customer.active)
    );
  });

  return (
    <section className="customer-page customer-panel">
      <div className="customer-toolbar">
        <button
          className="primary-button"
          type="button"
          onClick={() => navigate("/App/Customers/CreateNew")}
        >
          Add Customer
        </button>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search Customer...."
        />
        <label>
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(event) => setIncludeInactive(event.target.checked)}
          />{" "}
          Include InActive
        </label>
      </div>
      <div className="customer-table-wrap">
        <table className="customer-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Credit Agent</th>
              <th>Loan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>
                  <strong>{customer.altName}</strong>
                  <small>{customer.fullName}</small>
                </td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.branch}</td>
                <td>{customer.creditAgent}</td>
                <td>
                  <span
                    className={`customer-status ${customer.loanActive ? "active" : "inactive"}`}
                  >
                    {customer.loanActive ? "Active Loan" : "No Loan"}
                  </span>
                </td>
                <td>
                  <span
                    className={`customer-status ${customer.active ? "active" : "inactive"}`}
                  >
                    {customer.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() =>
                      navigate(`/App/Customers/${customer.id}/Details`)
                    }
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
