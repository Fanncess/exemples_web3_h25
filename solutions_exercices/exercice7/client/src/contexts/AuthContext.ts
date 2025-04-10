import { createContext } from "react";

export type Utilisateur = {
  nomUtilisateur: string;
  motDePasse: string;
};

type AuthContextType = {
  utilisateur: Utilisateur | undefined;
  setUtilisateur: (utilisateur: Utilisateur) => void;
};

export const AuthContext = createContext<AuthContextType>({
  utilisateur: undefined,
  setUtilisateur: () => {},
});
