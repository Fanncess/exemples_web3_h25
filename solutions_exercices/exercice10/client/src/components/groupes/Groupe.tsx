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
    <div className="d-flex gap-2">
      <Button
        variant={estGroupeCourant ? "success" : "outline-success"}
        ref={boutonGroupe}
        className="border-4 text-start flex-fill"
        onClick={() => navigate(`/messagerie/groupe/${groupe.id}`)}
      >
        <span className="fw-bold align-middle ms-2">{groupe.nom}</span>
      </Button>
      {groupe.createurId === user?.sub && (
        <>
          <Button
            variant="secondary"
            onClick={gererClicAjoutUtilisateur}
            title="Ajouter un utilisateur"
            className="px-3"
          >
            +
          </Button>
          <GroupeUtilisateurForm
            groupe={groupe}
            show={afficherModalAjoutUtilisateur}
            onClose={() => setAfficherModalAjoutUtilisateur(false)}
          />
        </>
      )}
    </div>
  );
}
