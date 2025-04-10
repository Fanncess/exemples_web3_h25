import { useAuth0 } from "@auth0/auth0-react";
import { FormEvent, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export function GroupeForm() {
  const [validated, setValidated] = useState(false);
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  async function envoyerNouveauGroupe() {
    try {
      const token = await getAccessTokenSilently();
      const reponse = await fetch(`${apiUrl}/api/groupes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom: nom }),
      });

      if (!reponse.ok) {
        throw new Error();
      }

      setErreur("");
      navigate(window.location); // Recharge la page pour afficher le nouveau groupe
    } catch (_erreur) {
      setErreur("Une erreur est survenue lors de la création du groupe.");
    }
  }

  function gererSoumission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (event.currentTarget.checkValidity() === false) {
      return;
    }

    envoyerNouveauGroupe();
    setNom("");
    setValidated(false);
  }

  return (
    <div className="d-flex flex-column gap-2 border border-4 border-warning p-2 rounded">
      <Alert
        variant="danger"
        show={!!erreur}
        className="mb-0"
        onClose={() => setErreur("")}
        dismissible
      >
        {erreur}
      </Alert>
      <Form
        noValidate
        validated={validated}
        onSubmit={gererSoumission}
        className="d-flex gap-2"
      >
        <Form.Control
          type="text"
          placeholder="Nom du groupe"
          required
          className="flex-fill"
          value={nom}
          onChange={(event) => setNom(event.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </Form>
    </div>
  );
}
