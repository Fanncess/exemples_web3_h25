import { useState } from "react";
import { GroupeContext } from "~/contexts/GroupeContext";

type Props = {
  children: React.ReactNode;
};

export function GroupeContextProvider({ children }: Props) {
  const [groupeIdCourant, setGroupeIdCourant] = useState(1);

  return (
    <GroupeContext.Provider
      value={{ groupeIdCourant, changerGroupe: setGroupeIdCourant }}
    >
      {children}
    </GroupeContext.Provider>
  );
}