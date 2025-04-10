import { useAuth0 } from "@auth0/auth0-react";
import { FormEvent, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export function MessageForm() {
  const [validated, setValidated] = useState(false);
  const [texteMessage, setTexteMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const { groupeId } = useParams();
  const { getAccessTokenSilently, user } = useAuth0();

  async function envoyerMessage() {
    try {
      const token = await getAccessTokenSilently();
      const reponse = await fetch(
        `${apiUrl}/api/groupes/${groupeId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texte: texteMessage,
            nomUtilisateur: user?.name || "Anonyme",
          }),
        }
      );

      if (!reponse.ok) {
        throw new Error();
      }

      setErreur("");
    } catch (_erreur) {
      setErreur("Une erreur est survenue lors de l'envoi du message.");
    }
  }

  function gererSoumission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (event.currentTarget.checkValidity() === false) {
      return;
    }

    envoyerMessage();
    setTexteMessage("");
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
        className="d-flex gap-2"
      >
        <Form.Control
          as="textarea"
          placeholder="Message"
          required
          className="flex-fill"
          value={texteMessage}
          onChange={(event) => setTexteMessage(event.target.value)}
          style={{ minWidth: "7rem" }}
        />
        <button type="submit" className="btn btn-primary">
          Envoyer
        </button>
      </Form>
    </div>
  );
}
