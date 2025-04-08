import { useEffect, useState } from "react";
import { Alert, Nav, Spinner } from "react-bootstrap";
import { Groupe } from "~/components/groupes/Groupe";

type Groupe = {
  id: number;
  nom: string;
  createurId: string;
};

function simulerFetchGroupes() {
  return new Promise<Response>((resolve) => {
    setTimeout(() => {
      resolve(new Response(JSON.stringify([
        { id: 1, nom: "Groupe 1", createurId: "auth0|67bf42a368be7b245b4ca1e1" },
        { id: 2, nom: "Groupe 2", createurId: "auth0|67bf4268e6c019494585e130" },
        { id: 3, nom: "Groupe 3", createurId: "auth0|67bf4268e6c019494585e130" },
      ]), { status: 200 }));
    }, 1000);
  });
}

export function Groupes() {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    setChargement(true);

    const abortControler = new AbortController();

    async function recupererGroupes() {
      try {
        const reponse = await simulerFetchGroupes();

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
  }, []);

  if (chargement) {
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
      className="d-flex flex-column gap-2 border border-4 border-danger p-2 rounded overflow-auto"
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
