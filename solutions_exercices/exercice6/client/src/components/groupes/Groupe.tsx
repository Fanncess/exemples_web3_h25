import { useContext, useEffect, useRef } from "react";
import type { Groupe } from "~/constants/groupes";
import { GroupeContext } from "~/contexts/GroupeContext";

type Props = {
  groupe: Groupe;
};

export function Groupe({ groupe }: Props) {
  const boutonGroupe = useRef<HTMLButtonElement>(null);
  const { groupeIdCourant, changerGroupe } = useContext(GroupeContext);

  const estGroupeCourant = groupeIdCourant === groupe.id;

  useEffect(() => {
    if (estGroupeCourant) {
      boutonGroupe.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [estGroupeCourant]);

  return (
    <button
      ref={boutonGroupe}
      className={`btn btn-outline-success p-2 border border-4 border-success text-start rounded ${
        estGroupeCourant ? "text-bg-success" : ""
      }`}
      onClick={() => changerGroupe(groupe.id)}
    >
      <img
        src={groupe.image}
        className="rounded-circle"
        width="32"
        height="32"
      />
      <span className="fw-bold align-middle ms-2 d-none d-sm-inline">{groupe.nom}</span>
    </button>
  );
}