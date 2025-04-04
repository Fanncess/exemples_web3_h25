export type Produit = {
  categorie: string;
  prix: string;
  enStock: boolean;
  nom: string;
};

export const PRODUITS: Produit[] = [
  {categorie: "Fruits", prix: "$1", enStock: true, nom: "Pomme"},
  {categorie: "Fruits", prix: "$1", enStock: true, nom: "Fruit du dragon"},
  {categorie: "Fruits", prix: "$2", enStock: false, nom: "Fruit de la passion"},
  {categorie: "Légumes", prix: "$2", enStock: true, nom: "Épinard"},
  {categorie: "Légumes", prix: "$4", enStock: false, nom: "Citrouille"},
  {categorie: "Légumes", prix: "$1", enStock: true, nom: "Petits pois"}
];
