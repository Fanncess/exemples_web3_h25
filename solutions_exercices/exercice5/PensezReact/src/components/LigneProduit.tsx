import type { Produit } from "~/constants/produits";

type Props = {
  produit: Produit;
};

export function LigneProduit({produit}: Props) {
  const nom = produit.enStock ? (
    produit.nom
  ) : (
    <span className="text-danger">
      {produit.nom}
    </span>
  );

  return (
    <tr>
      <td>{nom}</td>
      <td>{produit.prix}</td>
    </tr>
  );
}
