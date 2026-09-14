import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CustomerContext } from "./customerContext";
import { initialCustomers } from "./data";
import type { CustomerFormValues, CustomerRecord } from "./types";

function nextId(customers: CustomerRecord[]) {
  const highest = customers.reduce(
    (max, item) => Math.max(max, Number(item.id) || 0),
    1000,
  );
  return String(highest + 1);
}

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] =
    useState<CustomerRecord[]>(initialCustomers);

  const getCustomer = useCallback(
    (customerId: string) => customers.find((item) => item.id === customerId),
    [customers],
  );

  const createCustomer = useCallback(
    (values: CustomerFormValues) => {
      const created: CustomerRecord = { ...values, id: nextId(customers) };
      setCustomers((items) => [...items, created]);
      return created;
    },
    [customers],
  );

  const updateCustomer = useCallback(
    (customerId: string, values: CustomerFormValues) => {
      const updated: CustomerRecord = { ...values, id: customerId };
      setCustomers((items) =>
        items.map((item) => (item.id === customerId ? updated : item)),
      );
      return updated;
    },
    [],
  );

  const deleteCustomer = useCallback((customerId: string) => {
    setCustomers((items) => items.filter((item) => item.id !== customerId));
  }, []);

  const value = useMemo(
    () => ({
      customers,
      getCustomer,
      createCustomer,
      updateCustomer,
      deleteCustomer,
    }),
    [customers, getCustomer, createCustomer, updateCustomer, deleteCustomer],
  );

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}
