import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CurrencyContext, type DailyRateDraft } from "./currencyContext";
import { initialCurrencies, initialNotes, initialSpotRates } from "./data";
import { formatDate } from "./types";
import type {
  CurrencyFormValues,
  CurrencyRecord,
  NoteFormValues,
  NoteRecord,
  SpotRateEntry,
  SpotRateRecord,
} from "./types";

function nextId(items: { id: number }[]) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] =
    useState<CurrencyRecord[]>(initialCurrencies);
  const [spotRates, setSpotRates] =
    useState<SpotRateRecord[]>(initialSpotRates);
  const [notes, setNotes] = useState<NoteRecord[]>(initialNotes);
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const getCurrency = useCallback(
    (currencyId: number) => currencies.find((item) => item.id === currencyId),
    [currencies],
  );

  const createCurrency = useCallback(
    (values: CurrencyFormValues) => {
      setCurrencies((current) => [
        ...current,
        { ...values, id: nextId(current), active: true },
      ]);
      notify(`Currency ${values.code} created`);
    },
    [notify],
  );

  const setSpotRate = useCallback(
    (currencyId: number, entry: SpotRateEntry) => {
      setSpotRates((current) => [
        ...current,
        { ...entry, id: nextId(current), currencyId },
      ]);
      setCurrencies((current) =>
        current.map((item) =>
          item.id === currencyId
            ? {
                ...item,
                spot: entry.spot,
                buying: entry.buying,
                selling: entry.selling,
              }
            : item,
        ),
      );
      notify("Spot rate updated");
    },
    [notify],
  );

  const saveDailySpotRates = useCallback(
    (date: string, rates: DailyRateDraft) => {
      setCurrencies((current) =>
        current.map((item) =>
          rates[item.id] ? { ...item, ...rates[item.id] } : item,
        ),
      );
      setSpotRates((current) => {
        let id = Math.max(0, ...current.map((rate) => rate.id));
        const additions = Object.entries(rates).map(([currencyId, rate]) => {
          id += 1;
          return { id, currencyId: Number(currencyId), date, ...rate };
        });
        return [...current, ...additions];
      });
      notify(`Spot rates saved for ${formatDate(date)}`);
    },
    [notify],
  );

  const addNote = useCallback(
    (values: NoteFormValues) => {
      setNotes((current) => [
        ...current,
        { ...values, id: nextId(current), quantity: 0, active: true },
      ]);
      notify("Currency note added");
    },
    [notify],
  );

  const toggleNote = useCallback(
    (noteId: number) => {
      setNotes((current) =>
        current.map((note) =>
          note.id === noteId ? { ...note, active: !note.active } : note,
        ),
      );
      notify("Currency note status updated");
    },
    [notify],
  );

  const value = useMemo(
    () => ({
      currencies,
      spotRates,
      notes,
      toast,
      notify,
      getCurrency,
      createCurrency,
      setSpotRate,
      saveDailySpotRates,
      addNote,
      toggleNote,
    }),
    [
      currencies,
      spotRates,
      notes,
      toast,
      notify,
      getCurrency,
      createCurrency,
      setSpotRate,
      saveDailySpotRates,
      addNote,
      toggleNote,
    ],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
