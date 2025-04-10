type Utilisateur = {
  nomUtilisateur: string;
  motDePasse: string;
};

export const UTILISATEURS: Utilisateur[] = [
  {
    nomUtilisateur: "admin",
    motDePasse: "admin",
  },
  {
    nomUtilisateur: "utilisateur1",
    motDePasse: "motdepasse1",
  },
  {
    nomUtilisateur: "utilisateur2",
    motDePasse: "motdepasse2",
  },
];
