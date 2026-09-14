import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BranchContext } from "./branchContext";
import { initialBranches } from "./data";
import type { BranchFormValues, BranchRecord } from "./types";

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<BranchRecord[]>(initialBranches);

  const getBranch = useCallback(
    (branchId: number) => branches.find((item) => item.branchId === branchId),
    [branches],
  );

  const createBranch = useCallback(
    (values: BranchFormValues) => {
      const created: BranchRecord = {
        ...values,
        branchId: Math.max(0, ...branches.map((item) => item.branchId)) + 1,
      };
      setBranches((items) => [...items, created]);
      return created;
    },
    [branches],
  );

  const updateBranch = useCallback(
    (branchId: number, values: BranchFormValues) => {
      const updated: BranchRecord = { ...values, branchId };
      setBranches((items) =>
        items.map((item) => (item.branchId === branchId ? updated : item)),
      );
      return updated;
    },
    [],
  );

  const deleteBranch = useCallback((branchId: number) => {
    setBranches((items) => items.filter((item) => item.branchId !== branchId));
  }, []);

  const changeBranchState = useCallback(
    (branchId: number, isActive: boolean) => {
      setBranches((items) =>
        items.map((item) =>
          item.branchId === branchId ? { ...item, isActive } : item,
        ),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      branches,
      getBranch,
      createBranch,
      updateBranch,
      deleteBranch,
      changeBranchState,
    }),
    [
      branches,
      getBranch,
      createBranch,
      updateBranch,
      deleteBranch,
      changeBranchState,
    ],
  );

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  );
}
