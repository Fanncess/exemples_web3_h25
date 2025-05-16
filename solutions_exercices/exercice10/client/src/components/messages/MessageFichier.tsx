import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Placeholder, Image } from "react-bootstrap";

type Fichier = {
  url: string;
  blob: Blob;
};

type Props = {
  url: string;
  alt: string;
};

export function MessageFichier({ url, alt }: Props) {
  const [fichier, setFichier] = useState<Fichier | undefined>(undefined);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const abortControler = new AbortController();

    async function telechargerFichier() {
      try {
        const token = await getAccessTokenSilently();
        const reponse = await fetch(url, {
          signal: abortControler.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reponse.ok) {
          throw new Error(
            "Une erreur est survenue lors de la récupération du fichier."
          );
        }

        const fichierBlob = await reponse.blob();
        const fichierLocalURL = URL.createObjectURL(fichierBlob);

        setFichier({
          url: fichierLocalURL,
          blob: fichierBlob,
        });
        setChargement(false);
      } catch (err) {
        if (!(err instanceof Error)) {
          console.error("Erreur inattendue", err);
          return;
        }

        if (err.name === "AbortError") {
          return;
        }

        console.error("Erreur", err);
      }
    }

    setChargement(true);
    setFichier(undefined);
    setErreur("");

    telechargerFichier();

    return () => {
      abortControler.abort();
    };
  }, [url]);

  if (chargement) {
    return (
      <Placeholder as="div" className="w-100 h-100" />
    );
  }

  if (erreur) {
    return (
      <div className="alert alert-danger" role="alert">
        {erreur}
      </div>
    );
  }

  return <Image className="d-block" style={{objectFit:"contain"}} src={fichier?.url} alt={alt} fluid/>;
}
