import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import { GroupeUtilisateurForm } from "./GroupeUtilisateurForm";

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
  const { user } = useAuth0();
  const [afficherModalAjoutUtilisateur, setAfficherModalAjoutUtilisateur] =
    useState(false);
  const navigate = useNavigate();

  const estGroupeCourant = Number(groupeId) === groupe.id;

  useEffect(() => {
    if (estGroupeCourant) {
      boutonGroupe.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [estGroupeCourant]);

  function gererClicAjoutUtilisateur(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();
    setAfficherModalAjoutUtilisateur(true);
  }

  return (
    <button
      ref={boutonGroupe}
      className={`btn btn-outline-success p-2 border border-4 border-success text-start rounded d-flex align-items-center justify-content-between ${
        estGroupeCourant ? "text-bg-success" : ""
      }`}
      onClick={(e) => !e.isPropagationStopped() && navigate(`/messagerie/groupe/${groupe.id}`)}
    >
      <span className="fw-bold align-middle ms-2">{groupe.nom}</span>
      {groupe.createurId === user?.sub && (
        <>
          <Button variant="secondary" onClick={gererClicAjoutUtilisateur} title="Ajouter un utilisateur">
            +
          </Button>
          <GroupeUtilisateurForm
            groupe={groupe}
            show={afficherModalAjoutUtilisateur}
            onClose={() => setAfficherModalAjoutUtilisateur(false)}
          />
        </>
      )}
    </button>
  );
}
