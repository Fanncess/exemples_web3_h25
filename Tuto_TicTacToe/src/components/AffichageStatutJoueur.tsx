type Props = {
  joueurCourant: string;
  gagnant: string | undefined;
};

export function AffichageStatutJoueur({ joueurCourant, gagnant }: Props) {
  if (gagnant) {
    return (
      <div className="alert alert-success text-center">
        Le gagnant est <span className="fw-bold">{gagnant}</span>
      </div>
    );
  }
  
  return (
    <div className="alert alert-primary text-center">
      C'est au tour de <span className="fw-bold">{joueurCourant}</span> de jouer
    </div>
  );
}