import { createContext, useContext } from "react";
import type { CustomerFormValues, CustomerRecord } from "./types";

export type CustomerStore = {
  customers: CustomerRecord[];
  getCustomer: (customerId: string) => CustomerRecord | undefined;
  createCustomer: (values: CustomerFormValues) => CustomerRecord;
  updateCustomer: (
    customerId: string,
    values: CustomerFormValues,
  ) => CustomerRecord;
  deleteCustomer: (customerId: string) => void;
};

export const CustomerContext = createContext<CustomerStore | null>(null);

export function useCustomerStore() {
  const store = useContext(CustomerContext);
  if (!store) {
    throw new Error("useCustomerStore must be used inside CustomerProvider");
  }
  return store;
}
