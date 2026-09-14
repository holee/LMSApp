export type PageType = "tab" | "dialog" | "page";

export type BranchRecord = {
  branchId: number;
  branchName: string;
  branchCode: string;
  description: string;
  phoneNumber: string;
  zone: string;
  bankRefId: number | null;
  bankName: string;
  imagePath: string;
  isActive: boolean;
  isHeadOffice: boolean;
  countryName: string;
  city: string;
  provinceRefId: number | null;
  districtRefId: number | null;
  communeRefId: number | null;
  villageRefId: number | null;
  proInKhmer: string;
  disInKhmer: string;
  comInKhmer: string;
  vilInKhmer: string;
};

export type BranchFormValues = Omit<BranchRecord, "branchId">;

export type AddressOption = {
  id: number;
  nameInKhmer: string;
  description: string;
  parentId: number | null;
};

export type BranchFormErrors = Partial<Record<keyof BranchFormValues, string>>;

export function toBranchFormValues(branch: BranchRecord): BranchFormValues {
  return {
    branchName: branch.branchName,
    branchCode: branch.branchCode,
    description: branch.description,
    phoneNumber: branch.phoneNumber,
    zone: branch.zone,
    bankRefId: branch.bankRefId,
    bankName: branch.bankName,
    imagePath: branch.imagePath,
    isActive: branch.isActive,
    isHeadOffice: branch.isHeadOffice,
    countryName: branch.countryName,
    city: branch.city,
    provinceRefId: branch.provinceRefId,
    districtRefId: branch.districtRefId,
    communeRefId: branch.communeRefId,
    villageRefId: branch.villageRefId,
    proInKhmer: branch.proInKhmer,
    disInKhmer: branch.disInKhmer,
    comInKhmer: branch.comInKhmer,
    vilInKhmer: branch.vilInKhmer,
  };
}

export function formatBranchAddress(branch: BranchRecord) {
  return [
    branch.vilInKhmer && `ភូមិ${branch.vilInKhmer}`,
    branch.comInKhmer && `ឃុំ${branch.comInKhmer}`,
    branch.disInKhmer && `ស្រុក${branch.disInKhmer}`,
    branch.proInKhmer && `ខេត្ត${branch.proInKhmer}`,
  ]
    .filter(Boolean)
    .join(", ");
}
