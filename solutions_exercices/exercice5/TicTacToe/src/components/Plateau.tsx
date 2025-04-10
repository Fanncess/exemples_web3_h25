import { Case } from "~/components/Case";

type Props = {
  cases: string[];
  onActionJoueur: (indexCase: number) => void;
};

export function Plateau({ cases, onActionJoueur }: Props) {
  return (
    <table className="table table-bordered">
      <tbody>
        <tr>
          <Case valeur={cases[0]} onClick={() => onActionJoueur(0)} />
          <Case valeur={cases[1]} onClick={() => onActionJoueur(1)} />
          <Case valeur={cases[2]} onClick={() => onActionJoueur(2)} />
        </tr>
        <tr>
          <Case valeur={cases[3]} onClick={() => onActionJoueur(3)} />
          <Case valeur={cases[4]} onClick={() => onActionJoueur(4)} />
          <Case valeur={cases[5]} onClick={() => onActionJoueur(5)} />
        </tr>
        <tr>
          <Case valeur={cases[6]} onClick={() => onActionJoueur(6)} />
          <Case valeur={cases[7]} onClick={() => onActionJoueur(7)} />
          <Case valeur={cases[8]} onClick={() => onActionJoueur(8)} />
        </tr>
      </tbody>
    </table>
  );
}
