import type { Produit } from "~/constants/produits";
import { LigneCategorieProduit } from "~/components/LigneCategorieProduit";
import { LigneProduit } from "./LigneProduit";

type Props = {
  produits: Produit[];
  filtre: string;
  enStockSeulement: boolean;
};

export function TableProduit({ produits, filtre, enStockSeulement }: Props) {
  let categorieCourante = "";

  return (
    <table className="table table-striped w-auto">
      <thead className="table-dark">
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {produits.map((produit) => {
          if (produit.nom.toLowerCase().indexOf(filtre.toLowerCase()) === -1) {
            return;
          }

          if (!produit.enStock && enStockSeulement) {
            return;
          }

          const afficherLigneCategorieProduit = produit.categorie !== categorieCourante;
          if (afficherLigneCategorieProduit) {
            categorieCourante = produit.categorie;
          }

          return (
            <>
              {afficherLigneCategorieProduit && (
                <LigneCategorieProduit categorie={produit.categorie} />
              )}
              <LigneProduit produit={produit} />
            </>
          );
        })}
      </tbody>
    </table>
  );
}
