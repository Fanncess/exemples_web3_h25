import { FormEvent, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router";

export function MessageForm() {
  const [validated, setValidated] = useState(false);
  const [texteMessage, setTexteMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const { groupeId } = useParams();

  const formulaire = useRef<HTMLFormElement>(null);

  async function envoyerMessage(texteMessage: string) {
    try {
      const reponse = new Response(null, { status: 200 });

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

    if (!formulaire.current) {
      return;
    }

    if (formulaire.current.checkValidity() === false) {
      return;
    }

    envoyerMessage(texteMessage);
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
        ref={formulaire}
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
        />
        <button type="submit" className="btn btn-primary">
          Envoyer
        </button>
      </Form>
    </div>
  );
}
