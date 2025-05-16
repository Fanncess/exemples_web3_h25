import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

export function PageDeconnexion() {
  const navigate = useNavigate();
  const { logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  // Si l'utilisateur n'est pas connecté, on le redirige vers la page d'accueil
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  // Si l'utilisateur est connecté, on le déconnecte
  logout();

  return <p>Déconnexion en cours</p>;
}
