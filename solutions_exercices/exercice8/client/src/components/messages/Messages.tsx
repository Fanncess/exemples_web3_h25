import { Message } from "~/components/messages/Message";
import { useEffect, useRef, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

type Message = {
  id: number;
  nomUtilisateur: string;
  texte: string;
  dateAjout: string;
};

const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [erreur, setErreur] = useState("");
  const { groupeId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const divMessages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: number;
    const abortControler = new AbortController();
    let estAnnule = false;

    async function recupererMessages() {
      if (!groupeId) {
        // Si le composant n'est pas démonté, on relance le rafraîchissement des messages
        if (!estAnnule) {
          // Rafrachit les messages après 1 seconde
          timeoutId = setTimeout(recupererMessages, 1000);
        }
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        const reponse = await fetch(
          `${apiUrl}/api/groupes/${groupeId}/messages`,
          {
            signal: abortControler.signal,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!reponse.ok) {
          throw new Error(
            "Une erreur est survenue lors de la récupération des messages."
          );
        }

        const messagesObtenus = await reponse.json();

        setMessages((messagesCourant) => {
          // Si le nombre de messages a changé, on les met à jour
          if (messagesCourant.length !== messagesObtenus.length) {
            return messagesObtenus;
          }

          // Si un message a changé, on les met à jour
          for (let i = 0; i < messagesCourant.length; i++) {
            if (messagesCourant[i].id !== messagesObtenus[i].id) {
              return messagesObtenus;
            }
          }

          // Sinon, on ne fait rien
          return messagesCourant;
        });

        setErreur("");
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
        // Si le composant n'est pas démonté, on relance le rafraîchissement des messages
        if (!estAnnule) {
          // Rafrachit les messages après 1 seconde
          timeoutId = setTimeout(recupererMessages, 1000);
        }
      }
    }

    setMessages([]); // Réinitialise les messages
    recupererMessages(); // Appel immédiat de la fonction asynchrone

    // Retourne une fonction de nettoyage qui sera appelée lorsque le composant sera démonté
    // ou lorsque les dépendances (getAccessTokenSilently, groupeId) du hook useEffect changent.
    return () => {
      // Arrête le rafraîchissement des messages pour éviter les appels en double et les fuites de mémoire
      clearTimeout(timeoutId);
      estAnnule = true;
      abortControler.abort();
    };
  }, [getAccessTokenSilently, groupeId]); // Le hook useEffect s'exécute à chaque changement de groupeIdCourant

  useEffect(() => {
    if (!divMessages.current) {
      return;
    }

    divMessages.current.scrollTo({
      top: divMessages.current.scrollHeight,
      behavior: "instant",
    });
  }, [messages]);

  return (
    <div className="flex-fill d-flex flex-column border border-4 border-primary p-2 overflow-auto rounded gap-2">
      <Alert
        variant="danger"
        show={!!erreur}
        className="mb-0"
        onClose={() => setErreur("")}
        dismissible
      >
        {erreur}
      </Alert>
      {messages.length === 0 && (
        <Spinner animation="border" role="status" className="m-auto">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      )}
      <div
        ref={divMessages}
        className="flex-fill d-flex flex-column overflow-auto gap-2"
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
