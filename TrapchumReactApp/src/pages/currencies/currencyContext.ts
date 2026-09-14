import { createContext, useContext } from "react";
import type {
  CurrencyFormValues,
  CurrencyRecord,
  NoteFormValues,
  NoteRecord,
  SpotRateEntry,
  SpotRateRecord,
} from "./types";

export type DailyRateDraft = Record<
  number,
  { spot: number; buying: number; selling: number }
>;

export type CurrencyStore = {
  currencies: CurrencyRecord[];
  spotRates: SpotRateRecord[];
  notes: NoteRecord[];
  toast: string | null;
  notify: (message: string) => void;
  getCurrency: (currencyId: number) => CurrencyRecord | undefined;
  createCurrency: (values: CurrencyFormValues) => void;
  setSpotRate: (currencyId: number, entry: SpotRateEntry) => void;
  saveDailySpotRates: (date: string, rates: DailyRateDraft) => void;
  addNote: (values: NoteFormValues) => void;
  toggleNote: (noteId: number) => void;
};

export const CurrencyContext = createContext<CurrencyStore | null>(null);

export function useCurrencyStore() {
  const store = useContext(CurrencyContext);
  if (!store) {
    throw new Error("useCurrencyStore must be used inside CurrencyProvider");
  }
  return store;
}
