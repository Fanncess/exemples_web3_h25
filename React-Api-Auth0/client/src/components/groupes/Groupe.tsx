import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";

type Groupe = {
  id: number;
  nom: string;
  createurId: string;
};

type Props = {
  groupe: Groupe;
};

export function Groupe({ groupe }: Props) {
  const boutonGroupe = useRef<HTMLButtonElement>(null);
  const { groupeId } = useParams();
  const navigate = useNavigate();

  const estGroupeCourant = Number(groupeId) === groupe.id;

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
      onClick={() => navigate(`/messagerie/groupe/${groupe.id}`)}
    >
      <span className="fw-bold align-middle ms-2 d-none d-sm-inline">{groupe.nom}</span>
    </button>
  );
}
