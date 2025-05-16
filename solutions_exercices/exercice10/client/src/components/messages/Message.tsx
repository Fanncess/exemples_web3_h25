import { Carousel } from "react-bootstrap";
import { useParams } from "react-router";
import { MessageFichier } from "~/components/messages/MessageFichier";

type Message = {
  id: number;
  nomUtilisateur: string;
  texte: string;
  dateAjout: string;
  fichiers: string[];
};

type Props = {
  message: Message;
};

const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export function Message({ message }: Props) {
  const date = new Date(message.dateAjout);
  const { groupeId } = useParams();

  return (
    <div className="card p-2 border-4 border-warning">
      <div className="d-flex">
        <span className="fw-bold flex-fill">{message.nomUtilisateur}</span>
        <span className="fw-light text-secondary float-end d-none d-sm-inline">
          {new Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          }).format(date)}
        </span>
        <span className="fw-light text-secondary float-end d-sm-none">
          {new Intl.DateTimeFormat().format(date)}
        </span>
      </div>
      <p className="mb-0">{message.texte}</p>
      <Carousel>
        {message.fichiers.map((nomFichier) => (
          <Carousel.Item key={nomFichier} className="ratio ratio-4x3">
            <MessageFichier
              url={`${apiUrl}/api/Groupes/${groupeId}/Messages/${message.id}/fichiers/${nomFichier}`}
              alt={nomFichier}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
