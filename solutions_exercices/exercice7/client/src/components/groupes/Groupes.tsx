import { useContext, useEffect, useState } from "react";
import { Alert, Nav, Spinner } from "react-bootstrap";
import { Groupe } from "~/components/groupes/Groupe";
import { AuthContext } from "~/contexts/AuthContext";

type Groupe = {
  id: number;
  nom: string;
  createurId: string;
};

export function Groupes() {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);
  const { utilisateur } = useContext(AuthContext);

  useEffect(() => {
    setChargement(true);

    const abortControler = new AbortController();

    async function recupererGroupes() {
      try {
        const reponse = await fetch(`https://localhost:7213/api/utilisateurs`, {
          signal: abortControler.signal,
          headers: { ...utilisateur },
        });

        if (!reponse.ok) {
          throw new Error(
            "Une erreur est survenue lors de la récupération des groupes."
          );
        }

        const donnees = await reponse.json();
        setGroupes(donnees.groupes);
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
  }, [utilisateur]);

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
