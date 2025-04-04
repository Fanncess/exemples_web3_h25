import { useState, useEffect } from "react";
import { useParams } from "react-router";

type Donnees = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export function ComposantRecuperationDonnees() {
  const { postId } = useParams();
  const [donnees, setDonnees] = useState<Donnees[]>([]);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const controleur = new AbortController();

    async function recupererDonnees() {
      try {
        setChargement(true);
        const reponse = await fetch(
          `https://jsonplaceholder.typicode.com/posts${postId ? `/${postId}` : ""}`,
          { signal: controleur.signal }
        );
        if (!reponse.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const resultat = await reponse.json();
        if (postId) {
          // Si un postId est fourni, on récupère un seul élément
          // et on le place dans un tableau pour l'affichage dans la liste
          setDonnees([resultat]);
          return;
        }
        setDonnees(resultat);
      } catch (erreur) {
        if (!(erreur instanceof Error)) {
          setErreur("Une erreur est survenue");
          return;
        }

        if (erreur.name === "AbortError") {
          return;
        }

        setErreur(erreur.message);
      } finally {
        setChargement(false);
      }
    }

    recupererDonnees();

    return () => {
      // Annule la requête si le composant est démonté
      controleur.abort();
    };
  }, []);

  if (chargement) {
    return <p>Chargement...</p>;
  }
  if (erreur) {
    return <p>Erreur: {erreur}</p>;
  }

  return (
    <ul>
      {donnees.map((element) => (
        <li key={element.id}>{element.title}</li>
      ))}
    </ul>
  );
}
