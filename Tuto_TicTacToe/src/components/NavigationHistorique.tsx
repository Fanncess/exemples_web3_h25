type Props = {
  historique: string[][];
  afficherTour: (tour: number) => void;
};

export function NavigationHistorique({ historique, afficherTour }: Props) {
  return (
    <ul className="list-unstyled">
      {historique.map((_, tour) => {
        const description = tour === 0 ? "Début de la partie" : `Tour #${tour}`;

        return (
          <li key={tour}>
            <button
              className="btn btn-light"
              onClick={() => afficherTour(tour)}
            >
              {description}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
