import type { AddressOption, BranchFormValues, BranchRecord } from "./types";

export const branchPlaceholderImage = "/assets/logo/tch_Logo.png";

export const pageSizeOptions = [10, 15, 20, 30, 50];

export const banks = [{ bankId: 1, bankName: "Trapchum Cash Pawn Shop" }];

export const provinces: AddressOption[] = [
  { id: 1, nameInKhmer: "ភ្នំពេញ", description: "Phnom Penh", parentId: null },
  { id: 2, nameInKhmer: "កណ្ដាល", description: "Kandal", parentId: null },
  { id: 3, nameInKhmer: "សៀមរាប", description: "Siem Reap", parentId: null },
];

export const districts: AddressOption[] = [
  { id: 11, nameInKhmer: "ចំការមន", description: "Chamkar Mon", parentId: 1 },
  { id: 12, nameInKhmer: "ដូនពេញ", description: "Daun Penh", parentId: 1 },
  { id: 21, nameInKhmer: "តាខ្មៅ", description: "Ta Khmau", parentId: 2 },
  { id: 31, nameInKhmer: "សៀមរាប", description: "Siem Reap", parentId: 3 },
];

export const communes: AddressOption[] = [
  {
    id: 111,
    nameInKhmer: "ទន្លេបាសាក់",
    description: "Tonle Basak",
    parentId: 11,
  },
  {
    id: 112,
    nameInKhmer: "បឹងកេងកង១",
    description: "Boeng Keng Kang 1",
    parentId: 11,
  },
  { id: 121, nameInKhmer: "ស្រះចក", description: "Srah Chak", parentId: 12 },
  { id: 211, nameInKhmer: "តាខ្មៅ", description: "Ta Khmau", parentId: 21 },
  {
    id: 311,
    nameInKhmer: "ស្វាយដង្គំ",
    description: "Svay Dangkum",
    parentId: 31,
  },
];

export const villages: AddressOption[] = [
  { id: 1111, nameInKhmer: "ភូមិ១", description: "Village 1", parentId: 111 },
  { id: 1112, nameInKhmer: "ភូមិ២", description: "Village 2", parentId: 111 },
  { id: 1121, nameInKhmer: "ភូមិ៣", description: "Village 3", parentId: 112 },
  { id: 1211, nameInKhmer: "ភូមិ៤", description: "Village 4", parentId: 121 },
  { id: 2111, nameInKhmer: "ភូមិ៥", description: "Village 5", parentId: 211 },
  { id: 3111, nameInKhmer: "ភូមិ៦", description: "Village 6", parentId: 311 },
];

export const emptyBranch: BranchFormValues = {
  branchName: "",
  branchCode: "",
  description: "",
  phoneNumber: "",
  zone: "",
  bankRefId: banks[0].bankId,
  bankName: banks[0].bankName,
  imagePath: branchPlaceholderImage,
  isActive: true,
  isHeadOffice: false,
  countryName: "កម្ពុជា",
  city: "",
  provinceRefId: null,
  districtRefId: null,
  communeRefId: null,
  villageRefId: null,
  proInKhmer: "",
  disInKhmer: "",
  comInKhmer: "",
  vilInKhmer: "",
};

export const initialBranches: BranchRecord[] = [
  {
    branchId: 1,
    branchName: "ការិយាល័យកណ្ដាល",
    branchCode: "HO-001",
    description: "ការិយាល័យកណ្ដាលនៅភ្នំពេញ",
    phoneNumber: "023 999 111",
    zone: "Zone A",
    bankRefId: 1,
    bankName: banks[0].bankName,
    imagePath: branchPlaceholderImage,
    isActive: true,
    isHeadOffice: true,
    countryName: "កម្ពុជា",
    city: "ភ្នំពេញ",
    provinceRefId: 1,
    districtRefId: 11,
    communeRefId: 111,
    villageRefId: 1111,
    proInKhmer: "ភ្នំពេញ",
    disInKhmer: "ចំការមន",
    comInKhmer: "ទន្លេបាសាក់",
    vilInKhmer: "ភូមិ១",
  },
  {
    branchId: 2,
    branchName: "សាខាតាខ្មៅ",
    branchCode: "BR-002",
    description: "សាខាខេត្តកណ្ដាល",
    phoneNumber: "024 555 222",
    zone: "Zone B",
    bankRefId: 1,
    bankName: banks[0].bankName,
    imagePath: branchPlaceholderImage,
    isActive: true,
    isHeadOffice: false,
    countryName: "កម្ពុជា",
    city: "តាខ្មៅ",
    provinceRefId: 2,
    districtRefId: 21,
    communeRefId: 211,
    villageRefId: 2111,
    proInKhmer: "កណ្ដាល",
    disInKhmer: "តាខ្មៅ",
    comInKhmer: "តាខ្មៅ",
    vilInKhmer: "ភូមិ៥",
  },
  {
    branchId: 3,
    branchName: "សាខាសៀមរាប",
    branchCode: "BR-003",
    description: "សាខាខេត្តសៀមរាប",
    phoneNumber: "063 777 333",
    zone: "Zone C",
    bankRefId: 1,
    bankName: banks[0].bankName,
    imagePath: branchPlaceholderImage,
    isActive: false,
    isHeadOffice: false,
    countryName: "កម្ពុជា",
    city: "សៀមរាប",
    provinceRefId: 3,
    districtRefId: 31,
    communeRefId: 311,
    villageRefId: 3111,
    proInKhmer: "សៀមរាប",
    disInKhmer: "សៀមរាប",
    comInKhmer: "ស្វាយដង្គំ",
    vilInKhmer: "ភូមិ៦",
  },
];
