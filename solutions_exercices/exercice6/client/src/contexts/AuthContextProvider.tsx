import { useState } from "react";
import { AuthContext, type Utilisateur } from "~/contexts/authContext";

type Props = {
  children: React.ReactNode;
};

export function AuthContextProvider({ children }: Props) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | undefined>(undefined);

  return (
    <AuthContext.Provider value={{ utilisateur, setUtilisateur }}>
      {children}
    </AuthContext.Provider>
  );
}