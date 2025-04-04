export type Groupe = {
  id: number;
  nom: string;
  image: string;
};

export const GROUPES: Groupe[] = [
  {
    id: 0,
    nom: "Anglais",
    image: "https://placehold.co/64x64/orangered/white?text=A",
  },
  {
    id: 1,
    nom: "Français",
    image: "https://placehold.co/64x64/royalblue/white?text=F",
  },
  {
    id: 2,
    nom: "Espagnol",
    image: "https://placehold.co/64x64/orange/white?text=E",
  },
  {
    id: 42,
    nom: "Erreur",
    image: "https://placehold.co/64x64/red/pink?text=Err",
  },
];
