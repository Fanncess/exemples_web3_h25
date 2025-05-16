import { useAuth0 } from "@auth0/auth0-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;
const MAX_TAILLE_FICHIER = 5 * 1024 * 1024; // 5 Mo

export function FichierForm() {
  const [validated, setValidated] = useState(false);
  const [titre, setTitre] = useState("");
  const [erreur, setErreur] = useState("");

  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  async function envoyerMessage() {
    try {
      const token = await getAccessTokenSilently();
      const reponse = await fetch(`${apiUrl}/api/fichiers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!reponse.ok) {
        throw new Error();
      }

      setErreur("");
    } catch (_erreur) {
      setErreur("Une erreur est survenue lors de l'envoi.");
    } finally {
      navigate(window.location); // Pour recharger la page
    }
  }

  function gererSoumission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const formulaire = event.currentTarget;

    if (formulaire.checkValidity() === false) {
      return;
    }

    envoyerMessage();
    setTitre("");

    setValidated(false);
  }

  return (
    <div className="d-flex flex-column gap-2 border border-4 border-secondary p-2 rounded">
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
          <Form.Label htmlFor="titre">Titre</Form.Label>
          <Form.Control
            type="text"
            id="titre"
            placeholder="Titre"
            required
            value={titre}
            onChange={(event) => setTitre(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="fichier">Fichier</Form.Label>
          <Form.Control
            type="file"
            id="fichier"
          />
          <Form.Control.Feedback type="invalid">
            {`Fichier trop volumineux. Taille maximale : ${
              MAX_TAILLE_FICHIER / 1024
            } Ko`}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary">
          Envoyer
        </Button>
      </Form>
    </div>
  );
}
