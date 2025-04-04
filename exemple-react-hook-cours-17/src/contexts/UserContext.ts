import { createContext } from "react";

const valeurDefaut = {
    nomComplet: "John Doe",
};

export const UserContext = createContext(valeurDefaut);
