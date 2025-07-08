import { atom } from "recoil";

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
