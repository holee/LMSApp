export type CurrencyRecord = {
  id: number;
  code: string;
  name: string;
  spot: number;
  buying: number;
  selling: number;
  limit: number;
  base: boolean;
  active: boolean;
};

export type CurrencyFormValues = Omit<CurrencyRecord, "id" | "active">;

export type SpotRateRecord = {
  id: number;
  currencyId: number;
  date: string;
  spot: number;
  buying: number;
  selling: number;
};

export type SpotRateEntry = Omit<SpotRateRecord, "id" | "currencyId">;

export type NoteRecord = {
  id: number;
  currencyId: number;
  code: string;
  name: string;
  value: number;
  quantity: number;
  description: string;
  active: boolean;
};

export type NoteFormValues = Pick<
  NoteRecord,
  "currencyId" | "code" | "name" | "value" | "description"
>;

export function formatRate(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export function formatValue(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCount(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
