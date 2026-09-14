export type CustomerRecord = {
  id: string;
  altName: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  branch: string;
  creditAgent: string;
  idCard: string;
  gender: string;
  maritalStatus: string;
  children: number;
  active: boolean;
  loanActive: boolean;
};

export type CustomerFormValues = Omit<CustomerRecord, "id">;

export const customerTextFields = [
  "altName",
  "fullName",
  "phone",
  "email",
  "address",
  "branch",
  "creditAgent",
  "idCard",
] as const;

export type CustomerTextField = (typeof customerTextFields)[number];

export function toCustomerFormValues(
  customer: CustomerRecord,
): CustomerFormValues {
  return {
    altName: customer.altName,
    fullName: customer.fullName,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    branch: customer.branch,
    creditAgent: customer.creditAgent,
    idCard: customer.idCard,
    gender: customer.gender,
    maritalStatus: customer.maritalStatus,
    children: customer.children,
    active: customer.active,
    loanActive: customer.loanActive,
  };
}

export function formatFieldLabel(field: string) {
  return field.replace(/([A-Z])/g, " $1");
}

export function customerInitials(fullName: string) {
  return fullName.slice(0, 2).toUpperCase();
}
