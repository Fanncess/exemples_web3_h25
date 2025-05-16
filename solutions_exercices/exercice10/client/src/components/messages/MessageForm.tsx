import { useAuth0 } from "@auth0/auth0-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;
const MAX_TAILLE_FICHIER = 5 * 1024 * 1024; // 5 Mo

export function MessageForm() {
  const [validated, setValidated] = useState(false);
  const [texteMessage, setTexteMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [fichiers, setFichiers] = useState<File[]>([]);

  const { groupeId } = useParams();
  const inputFichiers = useRef<HTMLInputElement>(null);

  const { getAccessTokenSilently, user } = useAuth0();

  async function envoyerMessage() {
    try {
      const formData = new FormData();
      formData.append("texte", texteMessage);
      formData.append("nomUtilisateur", user?.name || "Anonyme");
      for (let i = 0; i < fichiers.length; i++) {
        formData.append("fichiers", fichiers[i]);
      }

      const token = await getAccessTokenSilently();
      const reponse = await fetch(
        `${apiUrl}/api/groupes/${groupeId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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

    const formulaire = event.currentTarget;

    if (formulaire.checkValidity() === false) {
      return;
    }

    envoyerMessage();
    setTexteMessage("");
    setFichiers([]);
    formulaire.reset(); // Pour vider l'input de fichier

    setValidated(false);
  }

  useEffect(() => {
    let erreur = "";
    if (fichiers.some((fichier) => fichier.size > MAX_TAILLE_FICHIER)) {
      erreur = "Fichier trop volumineux";
    }
    inputFichiers.current!.setCustomValidity(erreur);
  }, [fichiers]);

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
        <div className="d-flex flex-column gap-2 flex-fill">
          <Form.Control
            as="textarea"
            placeholder="Message"
            required
            value={texteMessage}
            onChange={(event) => setTexteMessage(event.target.value)}
            style={{ minWidth: "7rem" }}
            disabled={!groupeId}
          />
          <Form.Group>
            <Form.Control
              type="file"
              ref={inputFichiers}
              placeholder="Joindre un fichier"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFichiers([...(event.target?.files || [])])
              }
              disabled={!groupeId}
            />
            <Form.Control.Feedback type="invalid">
              {`Fichier trop volumineux. Taille maximale : ${
                MAX_TAILLE_FICHIER / 1024
              } Ko`}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!groupeId}>
          Envoyer
        </button>
      </Form>
    </div>
  );
}
