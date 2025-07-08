import { atom } from "recoil";
import { localStorageEffect } from "./localStoragePersist";

export const userAtom = atom({
  key: "userAtom",
  default: {
    id: "",
    name: "",
    email: "",
    role: "",
    organisation: [],
  },
  effects: [localStorageEffect("userAtom")],
});
