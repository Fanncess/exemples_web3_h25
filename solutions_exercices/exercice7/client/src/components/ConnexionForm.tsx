import { FormEvent, useContext, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";
import { AuthContext } from "~/contexts/AuthContext";

export function ConnexionForm() {
  const [validated, setValidated] = useState(false);
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const { setUtilisateur } = useContext(AuthContext);
  const navigate = useNavigate();

  async function connecterUtilisateur() {
    const utilisateur = {
      nomUtilisateur: nomUtilisateur,
      motDePasse: motDePasse,
    };

    try {
      const reponse = await fetch(`https://localhost:7213/api/connexion`, {
        method: "GET",
        headers: { ...utilisateur },
      });

      if (!reponse.ok) {
        if (reponse.status === 401) {
          throw new Error("Identifiants invalides");
        }
        throw new Error("Une erreur est survenue lors de la connexion.");
      }

      setErreur("");
      setUtilisateur(utilisateur);
      navigate("/messagerie");
    } catch (erreur) {
      if (erreur instanceof Error) {
        setErreur(erreur.message);
        return;
      }

      setErreur("Une erreur est survenue lors de la connexion.");
    }
  }

  function gererSoumission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (event.currentTarget.checkValidity() === false) {
      return;
    }

    connecterUtilisateur();
    setNomUtilisateur("");
    setMotDePasse("");
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
          <Form.Label>Nom d'utilisateur</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="johndoe"
            value={nomUtilisateur}
            onChange={(event) => setNomUtilisateur(event.target.value)}
            maxLength={255}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="********"
            value={motDePasse}
            onChange={(event) => setMotDePasse(event.target.value)}
            maxLength={255}
          />
        </Form.Group>
        <button type="submit" className="btn btn-primary">
          Se connecter
        </button>
      </Form>
    </div>
  );
}
