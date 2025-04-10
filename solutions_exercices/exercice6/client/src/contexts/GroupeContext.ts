import { createContext } from "react";

export type GroupeContextType = {
  groupeIdCourant: number;
  changerGroupe: (groupeId: number) => void;
};

const groupeContextParDefaut: GroupeContextType = {
  groupeIdCourant: 1,
  changerGroupe: () => {},  // fonction vide par défaut
};

export const GroupeContext = createContext(groupeContextParDefaut);