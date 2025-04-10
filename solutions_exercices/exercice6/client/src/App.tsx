import { useContext } from "react";
import { AuthContext } from "~/contexts/AuthContext";
import { Messagerie } from "~/components/Messagerie";
import { ConnexionForm } from "~/components/ConnexionForm";

export function App() {
  const { utilisateur } = useContext(AuthContext);

  let contenu = <Messagerie />;
  if (!utilisateur) {
    contenu = <ConnexionForm />;
  }

  return (
    <div className="d-flex flex-column vh-100 vw-100 gap-2">{contenu}</div>
  );
}
