import { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useLocation } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { Fichier } from "./Fichier";

type Fichier = {
  id: number;
  titre: string;
  nomFichier: string;
};

const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export function Fichiers() {
  const [fichiers, setFichiers] = useState<Fichier[]>([]);
  const [erreur, setErreur] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const location = useLocation();

  useEffect(() => {
    const abortControler = new AbortController();

    async function recupererFichiers() {
      try {
        const token = await getAccessTokenSilently();
        const reponse = await fetch(`${apiUrl}/api/fichiers`, {
          signal: abortControler.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reponse.ok) {
          throw new Error(
            "Une erreur est survenue lors de la récupération des fichiers."
          );
        }

        const fichiers = await reponse.json();
        setFichiers(fichiers);

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
      }
    }

    setFichiers([]);
    recupererFichiers();
    return () => {
      abortControler.abort();
    };
  }, [location.key]);

  return (
    <div className="flex-fill d-flex flex-column border border-4 border-primary p-2 overflow-auto rounded gap-2">
      <Alert
        variant="danger"
        show={!!erreur}
        className="mb-0"
        onClose={() => setErreur("")}
        dismissible
      >
        {erreur}
      </Alert>
      {fichiers.length === 0 && (
        <Spinner animation="border" role="status" className="m-auto">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      )}
      <ul className="list-group list-group-flush">
        {fichiers.map((fichier) => (
          <Fichier key={fichier.id} fichier={fichier}/>
        ))}
      </ul>
    </div>
  );
}
