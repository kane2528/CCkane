import { atom } from "recoil";
import { localStorageEffect } from "./localStoragePersist";
export const userAtom = atom({
  key: "userAtom", // unique ID
  default: {
    id: "",
    name: "",
    email: "",
    role: "",
    organisation: [],
  },
});
