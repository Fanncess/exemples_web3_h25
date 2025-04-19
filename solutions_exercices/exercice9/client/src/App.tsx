import { Route, Routes } from "react-router";
import { BarreNavigation } from "~/components/BarreNavigation";
import { PageAccueil } from "~/pages/PageAccueil";
import { PageConnexion } from "~/pages/auth/PageConnexion";
import { PageInscription } from "~/pages/auth/PageInscription";
import { PageDeconnexion } from "~/pages/auth/PageDeconnexion";
import { PageProfil } from "~/pages/PageProfil";
import { Container } from "react-bootstrap";
import { AuthenticationGuard } from "./components/auth/AuthenticationGuard";
import { PageMessagerie } from "./pages/PageMessagerie";

export function App() {
  return (
    <div className="d-flex flex-column vh-100 vw-100 gap-2">
      <BarreNavigation />
      <Container className="flex-fill d-flex">
        <Routes>
          <Route path="/" element={<PageAccueil />} />
          <Route
            path="/messagerie"
            element={<AuthenticationGuard component={PageMessagerie} />}
          ></Route>
          <Route
            path="/messagerie/groupe/:groupeId"
            element={<AuthenticationGuard component={PageMessagerie} />}
          ></Route>
          <Route path="/connexion" element={<PageConnexion />} />
          <Route path="/inscription" element={<PageInscription />} />
          <Route path="/deconnexion" element={<PageDeconnexion />} />
          <Route
            path="/profil"
            element={<AuthenticationGuard component={PageProfil} />}
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Container>
    </div>
  );
}
