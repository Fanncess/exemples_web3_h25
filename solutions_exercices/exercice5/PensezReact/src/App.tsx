import { useState } from "react";
import { BarreRecherche } from "./components/BarreRecherche";
import { TableProduit } from "./components/TableProduit";
import { PRODUITS } from "./constants/produits";

export function App() {
  // État de l'application
  const [filtre, setFiltre] = useState("");
  const [enStockSeulement, setEnStockSeulement] = useState(false);

  return (
    <div className="d-flex flex-column vh-100 vw-100 align-items-center p-4 gap-4">
      <BarreRecherche
        filtre={filtre}
        enStockSeulement={enStockSeulement}
        onFilterTextChange={setFiltre}
        onInStockOnlyChange={setEnStockSeulement}
      />
      <TableProduit
        produits={PRODUITS}
        filtre={filtre}
        enStockSeulement={enStockSeulement}
      />
    </div>
  );
}
