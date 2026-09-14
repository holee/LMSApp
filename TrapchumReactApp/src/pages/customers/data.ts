import type { CustomerFormValues, CustomerRecord } from "./types";

export const initialCustomers: CustomerRecord[] = [
  {
    id: "1001",
    altName: "សុខា លឹម",
    fullName: "Sokha Lim",
    phone: "012 345 678",
    email: "sokha@example.com",
    address: "Phnom Penh",
    branch: "Head Office",
    creditAgent: "Dara Chan",
    idCard: "ID-1001",
    gender: "Male",
    maritalStatus: "Married",
    children: 2,
    active: true,
    loanActive: true,
  },
  {
    id: "1002",
    altName: "ស្រីមុំ",
    fullName: "Srey Mom",
    phone: "097 555 901",
    email: "sreymom@example.com",
    address: "Kandal",
    branch: "Kandal",
    creditAgent: "Vanna Sok",
    idCard: "ID-1002",
    gender: "Female",
    maritalStatus: "Single",
    children: 0,
    active: true,
    loanActive: false,
  },
];

export const emptyCustomer: CustomerFormValues = {
  altName: "",
  fullName: "",
  phone: "",
  email: "",
  address: "",
  branch: "Head Office",
  creditAgent: "",
  idCard: "",
  gender: "Male",
  maritalStatus: "Single",
  children: 0,
  active: true,
  loanActive: false,
};

export const customerDetailTabs = [
  "Loan History",
  "Income & Expense",
  "Collaterals",
  "Loan Request",
  "Activities",
  "Notes",
];
