import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Alert, Nav, Spinner } from "react-bootstrap";
import { useLocation } from "react-router";
import { Groupe } from "~/components/groupes/Groupe";

type Groupe = {
  id: number;
  nom: string;
  createurId: string;
};

const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export function Groupes() {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);
  const location = useLocation();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setChargement(true);

    const abortControler = new AbortController();

    async function recupererGroupes() {
      try {
        const token = await getAccessTokenSilently();
        const reponse = await fetch(`${apiUrl}/api/groupes`, {
          signal: abortControler.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reponse.ok) {
          throw new Error("Une erreur est survenue lors de la récupération des groupes.");
        }

        const donnees = await reponse.json();
        setGroupes(donnees);
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
        setChargement(false);
      }
    }

    recupererGroupes();
    return () => {
      abortControler.abort();
    };
  }, [getAccessTokenSilently, location.key]);

  if (chargement && !groupes) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-fill">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Nav
      className="d-flex flex-column gap-2 border border-4 border-danger p-2 rounded overflow-auto  flex-fill"
      style={{ minWidth: "max-content" }}
    >
      <Alert
        variant="danger"
        className="text-center"
        show={!!erreur}
        onClose={() => setErreur("")}
        dismissible
      >
        {erreur}
      </Alert>
      {groupes.map((groupe) => (
        <Groupe key={groupe.id} groupe={groupe} />
      ))}
    </Nav>
  );
}
