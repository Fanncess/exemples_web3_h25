type Props = {
  filtre: string;
  enStockSeulement: boolean;
  onFilterTextChange: (text: string) => void;
  onInStockOnlyChange: (enStockSeulement: boolean) => void;
};

export function BarreRecherche({
  filtre,
  enStockSeulement,
  onFilterTextChange,
  onInStockOnlyChange,
}: Props) {
  return (
    <div className="d-flex flex-column gap-2">
      <input
        type="text"
        className="form-control"
        value={filtre}
        placeholder="Rechercher..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <div className="form-check">
        <input
          id="enStockSeulement"
          type="checkbox"
          className="form-check-input"        
          checked={enStockSeulement}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />
        <label htmlFor="enStockSeulement" className="form-check-label">
          Afficher seulement les produits en stock
        </label>
      </div>
    </div>
  );
}
