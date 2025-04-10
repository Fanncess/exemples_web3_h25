import { FormEvent, useContext, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router";
import { AuthContext } from "~/contexts/AuthContext";

export function MessageForm() {
  const [validated, setValidated] = useState(false);
  const [texteMessage, setTexteMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const { groupeId } = useParams();
  const { utilisateur } = useContext(AuthContext);

  async function envoyerMessage() {
    try {
      const reponse = await fetch(
        `https://localhost:7213/api/groupes/${groupeId}/messages`,
        {
          method: "POST",
          headers: {
            ...utilisateur,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texte: texteMessage
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
