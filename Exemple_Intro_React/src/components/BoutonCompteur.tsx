type Props = {
  compte: number;
  setCompte: (compte: number) => void;
}

export function BoutonCompteur({ compte, setCompte }: Props) {
  function gererClick() {
    setCompte(compte + 1);
  }

  return (
    <div>
      <button onClick={gererClick}>
        Compte&nbsp;: {compte}
      </button>
    </div>
  );
}
