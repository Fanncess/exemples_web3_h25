import { useAuth0 } from "@auth0/auth0-react";
import { FormEvent, useState } from "react";
import { Modal } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;

type Groupe = {
  id: number;
  nom: string;
  createurId: string;
};

type Props = {
  groupe: Groupe;
  show: boolean;
  onClose: () => void;
};

export function GroupeUtilisateurForm({ groupe, show, onClose }: Props) {
  const [validated, setValidated] = useState(false);
  const [userId, setUserId] = useState("");
  const [erreur, setErreur] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  async function envoyerAjoutUtilisateur() {
    try {
      const token = await getAccessTokenSilently();
      const reponse = await fetch(
        `${apiUrl}/api/groupes/${groupe.id}/utilisateurs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userId),
        }
      );

      if (!reponse.ok) {
        throw new Error();
      }

      setErreur("");
    } catch (_erreur) {
      setErreur(
        "Une erreur est survenue lors de l'ajout de l'utilisateur au groupe."
      );
    }
  }

  function gererSoumission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (event.currentTarget.checkValidity() === false) {
      return;
    }

    envoyerAjoutUtilisateur();
    setUserId("");
    setValidated(false);
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Ajouter un utilisateur à{" "}
          <span className="fst-italic">{groupe.nom}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          className="d-flex flex-column gap-2"
        >
          <Form.Group>
            <Form.Label>Id de l'utilisateur</Form.Label>
            <Form.Control
              type="text"
              placeholder="auth0|67bf4268e6c019494585e130"
              required
              className="flex-fill"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            />
          </Form.Group>
          <button type="submit" className="btn btn-primary">
            Ajouter
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
