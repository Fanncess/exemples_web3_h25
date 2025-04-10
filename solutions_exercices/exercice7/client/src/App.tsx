import { useContext, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { PageConnexion } from "~/pages/PageConnexion";
import { PageMessagerie } from "~/pages/PageMessagerie";
import { AuthContext } from "~/contexts/AuthContext";

export function App() {
  const { utilisateur } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    // et qu'il n'est pas sur la page de connexion
    if (!utilisateur && location.pathname !== "/connexion") {
      navigate("/connexion");
    }
  }, [utilisateur, location.pathname, navigate]);

  // N'afficher rien si l'utilisateur n'est pas connecté et qu'il n'est pas sur la page de connexion
  // Cela évite de montrer une erreur 404
  if (!utilisateur && location.pathname !== "/connexion") {
    return null;
  }

  return (
    <div className="d-flex flex-column vh-100 vw-100 gap-2">
      <Routes>
        <Route path="/messagerie" element={<PageMessagerie />}></Route>
        <Route
          path="/messagerie/groupe/:groupeId"
          element={<PageMessagerie />}
        ></Route>
        <Route path="/connexion" element={<PageConnexion />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}
