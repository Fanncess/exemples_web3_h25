import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { telechargerFichierBlob } from "~/utils/telecharger";

type Fichier = {
  id: number;
  titre: string;
  nomFichier: string;
};

type Props = {
  fichier: Fichier;
};

const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export function Fichier({ fichier }: Props) {
  const [erreur, setErreur] = useState("");
  const [telechargement, setTelechargement] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  async function telechargerFichier() {
    setTelechargement(true);
    setErreur("");

    try {
      const token = await getAccessTokenSilently();
      const reponse = await fetch(`${apiUrl}/api/fichiers/${fichier.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!reponse.ok) {
        throw new Error(
          "Une erreur est survenue lors du téléchargement du fichier."
        );
      }

      setErreur("");
    } catch (err) {
      if (!(err instanceof Error)) {
        setErreur("Erreur inattendue");
        return;
      }

      if (err.name === "AbortError") {
        setErreur("");
        return;
      }

      setErreur(err.message);
    } finally {
      setTelechargement(false);
    }
  }

  return (
    <li
      key={fichier.id}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      {fichier.titre}
      <Button
        className="badge rounded-pill align-items-center d-flex ps-2 pe-2"
        variant={erreur ? "danger" : "primary"}
        disabled={telechargement}
        onClick={telechargerFichier}
      >
        {fichier.nomFichier}
        {telechargement && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="ms-2"
          />
        )}
      </Button>
    </li>
  );
}
