import { createContext, useContext } from "react";
import type { BranchFormValues, BranchRecord } from "./types";

export type BranchStore = {
  branches: BranchRecord[];
  getBranch: (branchId: number) => BranchRecord | undefined;
  createBranch: (values: BranchFormValues) => BranchRecord;
  updateBranch: (branchId: number, values: BranchFormValues) => BranchRecord;
  deleteBranch: (branchId: number) => void;
  changeBranchState: (branchId: number, isActive: boolean) => void;
};

export const BranchContext = createContext<BranchStore | null>(null);

export function useBranchStore() {
  const store = useContext(BranchContext);
  if (!store) {
    throw new Error("useBranchStore must be used inside BranchProvider");
  }
  return store;
}
