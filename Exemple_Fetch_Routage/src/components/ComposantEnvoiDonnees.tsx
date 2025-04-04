import { FormEvent, useState } from "react";

type Donnees = {
  id: number;
  message: string;
  title: string;
};

export function ComposantEnvoiDonnees() {
  const [titre, setTitre] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [confirmation, setConfirmation] = useState<Donnees | undefined>(
    undefined
  );
  const [chargement, setChargement] = useState(false);

  async function gererSoumission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setChargement(true);
      const reponse = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: titre,
            message: message,
          }),
        }
      );

      if (!reponse.ok) {
        throw new Error("Erreur lors de l'envoi des données");
      }

      const resultat = (await reponse.json()) as Donnees;
      setConfirmation(resultat);
    } catch (erreur) {
      if (!(erreur instanceof Error)) {
        setErreur("Une erreur est survenue");
        return;
      }

      setErreur(erreur.message);
    } finally {
      setChargement(false);
    }
  }

  if (chargement) {
    return <p>Chargement...</p>;
  }
  if (erreur) {
    return <p>Erreur: {erreur}</p>;
  }
  if (confirmation) {
    return <p>Données envoyées avec succès: {JSON.stringify(confirmation)}</p>;
  }

  return (
    <form onSubmit={gererSoumission}>
      <input
        type="text"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        placeholder="Titre"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      ></textarea>
      <button type="submit">Envoyer</button>
    </form>
  );
}
