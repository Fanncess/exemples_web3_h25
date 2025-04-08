import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

export function PageConnexion() {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  // Si l'utilisateur est déjà connecté, on le redirige vers la page d'accueil
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion d'Auth0
  loginWithRedirect({
    appState: { returnTo: "/profil" },
    authorizationParams: { prompt: "login" },
  });

  return <p>Chargement de la page de connexion d'Auth0</p>;
}
