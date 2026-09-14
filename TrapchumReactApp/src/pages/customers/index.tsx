import { useLocation, useNavigate } from "react-router-dom";
import { CustomerDetailsPage } from "./CustomerDetailsPage";
import { CustomerForm } from "./CustomerForm";
import { CustomerListPage } from "./CustomerListPage";
import { CustomerProvider } from "./CustomerStore";
import { useCustomerStore } from "./customerContext";
import { emptyCustomer } from "./data";
import { toCustomerFormValues } from "./types";
import "./CustomerPages.css";

function CustomerCreatePage() {
  const navigate = useNavigate();
  const { createCustomer } = useCustomerStore();

  return (
    <CustomerForm
      title="Create Customer"
      initialValues={emptyCustomer}
      onClose={() => navigate("/App/Customers")}
      onSubmit={(values) => {
        const customer = createCustomer(values);
        navigate(`/App/Customers/${customer.id}/Details`);
      }}
    />
  );
}

function CustomerDetailsRoute({ customerId }: { customerId: string }) {
  const navigate = useNavigate();
  const { getCustomer, deleteCustomer } = useCustomerStore();
  const customer = getCustomer(customerId);

  if (!customer) {
    return <section className="customer-empty">Customer not found.</section>;
  }

  return (
    <CustomerDetailsPage
      customer={customer}
      onClose={() => navigate("/App/Customers")}
      onEdit={() => navigate(`/Customers/${customer.id}/Update`)}
      onDelete={() => {
        deleteCustomer(customer.id);
        navigate("/App/Customers");
      }}
    />
  );
}

function CustomerUpdatePage({ customerId }: { customerId: string }) {
  const navigate = useNavigate();
  const { getCustomer, updateCustomer } = useCustomerStore();
  const customer = getCustomer(customerId);

  if (!customer) {
    return <section className="customer-empty">Customer not found.</section>;
  }

  return (
    <CustomerForm
      title="Edit Customer"
      initialValues={toCustomerFormValues(customer)}
      onClose={() => navigate(`/App/Customers/${customer.id}/Details`)}
      onSubmit={(values) => {
        updateCustomer(customer.id, values);
        navigate(`/App/Customers/${customer.id}/Details`);
      }}
    />
  );
}

function CustomerRouter() {
  const normalizedPath = useLocation().pathname.toLowerCase();

  if (normalizedPath === "/app/customers/createnew") {
    return <CustomerCreatePage />;
  }

  const detailsMatch = normalizedPath.match(
    /^\/app\/customers\/([^/]+)\/details$/,
  );
  if (detailsMatch) {
    return <CustomerDetailsRoute customerId={detailsMatch[1]} />;
  }

  const updateMatch = normalizedPath.match(/^\/customers\/([^/]+)\/update$/);
  if (updateMatch) {
    return <CustomerUpdatePage customerId={updateMatch[1]} />;
  }

  return <CustomerListPage />;
}

export function CustomerPages() {
  return (
    <CustomerProvider>
      <CustomerRouter />
    </CustomerProvider>
  );
}
