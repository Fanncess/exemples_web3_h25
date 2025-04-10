import { Message } from "~/components/messages/Message";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { GroupeContext } from "~/contexts/GroupeContext";
import { simulerFecthGetMessage } from "~/constants/messages";

type Message = {
  id: number;
  nomUtilisateur: string;
  message: string;
  date: string;
};

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [erreur, setErreur] = useState("");
  
  const { groupeIdCourant } = useContext(GroupeContext);
  
  const divMessages = useRef<HTMLDivElement>(null);

  useEffect(() => {
      let timeoutId: number;
      let estAnnule = false;
  
      // useEffect ne peut pas être asynchrone, donc on crée une fonction asynchrone
      // et on l'appelle immédiatement.
      async function simulerFetchGetMessagesAsync() {
        try {
          // Simule un appel GET : await fech("https://api.example.com/messages")
          const reponse = await simulerFecthGetMessage(groupeIdCourant);
  
          if (!reponse.ok) {
            throw new Error();
          }
  
          const messagesObtenus = await reponse.json();
  
          if (estAnnule) { return; }
  
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
        } catch (_erreur) {
          if (estAnnule) { return; }
          setErreur("Une erreur est survenue lors de la récupération des messages.");
        } finally {
          // Si le composant n'est pas démonté, on relance le rafraîchissement des messages
          if (!estAnnule) {
            // Rafrachit les messages après 1 seconde
            timeoutId = setTimeout(simulerFetchGetMessagesAsync, 1000);
          }
        }
      }
  
      setMessages([]); // Réinitialise les messages
      simulerFetchGetMessagesAsync(); // Appel immédiat de la fonction asynchrone
  
      // Retourne une fonction de nettoyage qui sera appelée lorsque le composant sera démonté
      // ou lorsque les dépendances (groupeIdCourant) du hook useEffect changent.
      return () => {
        // Arrête le rafraîchissement des messages pour éviter les appels en double et les fuites de mémoire
        clearTimeout(timeoutId);
        estAnnule = true;
      };
    }, [groupeIdCourant]); // Le hook useEffect s'exécute à chaque changement de groupeIdCourant

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
          <span className="visually-hidden">Loading...</span>
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