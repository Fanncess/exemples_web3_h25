import { useState } from "react";
import { Plateau } from "~/components/Plateau";
import { NavigationHistorique } from "~/components/NavigationHistorique";
import { AffichageStatutJoueur } from "~/components/AffichageStatutJoueur";
import { calculerGagnant } from "~/utils/tictactoe";

export function App() {
  // État de l'application
  const [historique, setHistorique] = useState<string[][]>([Array(9).fill("")]);
  const [tourCourant, setTourCourant] = useState(0);

  // Constantes dérivées de l'état
  const joueurCourant = tourCourant % 2 === 0 ? "X" : "O";
  const casesCourantes = historique[tourCourant];
  const gagnant = calculerGagnant(casesCourantes);

  function gererActionJoueur(indexCase: number) {
    // Si la partie est terminée ou si la case est déjà occupée, on ne fait rien
    if (gagnant || casesCourantes[indexCase]) {
      return;
    }

    // On crée un nouvel état en copiant l'état actuel et en modifiant la case cliquée
    const etatApresAction = [...casesCourantes];
    etatApresAction[indexCase] = joueurCourant;

    // On ajoute le nouvel état à l'historique
    // Si on est à un tour antérieur, on écrase les tours suivants
    const nouvelHistorique = [
      ...historique.slice(0, tourCourant + 1),
      etatApresAction,
    ];

    // On met à jour l'état de l'application
    setHistorique(nouvelHistorique);
    setTourCourant(nouvelHistorique.length - 1);
  }

  function afficherTour(tourAAfficher: number) {
    setTourCourant(tourAAfficher);
  }

  return (
    <div className="d-flex vh-100 vw-100 justify-content-center align-items-center gap-2">
      <div className="d-flex flex-column gap-2">
        <AffichageStatutJoueur
          joueurCourant={joueurCourant}
          gagnant={gagnant}
        />
        <div className="d-flex gap-2">
          <div>
            <Plateau cases={casesCourantes} onActionJoueur={gererActionJoueur} />
          </div>
          <div>
            <NavigationHistorique
              historique={historique}
              afficherTour={afficherTour}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
