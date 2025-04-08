import { Route, Routes } from "react-router";
import { BarreNavigation } from "~/components/BarreNavigation";
import { PageAccueil } from "~/pages/PageAccueil";
import { PageProfil } from "~/pages/PageProfil";
import { Container } from "react-bootstrap";
import { PageMessagerie } from "./pages/PageMessagerie";

export function App() {
  return (
    <div className="d-flex flex-column vh-100 vw-100 gap-2">
      <BarreNavigation />
      <Container className="flex-fill d-flex">
        <Routes>
          <Route path="/" element={<PageAccueil />} />
          <Route path="/messagerie" element={<PageMessagerie />}></Route>
          <Route
            path="/messagerie/groupe/:groupeId"
            element={<PageMessagerie />}
          ></Route>
          <Route path="/profil" element={<PageProfil />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Container>
    </div>
  );
}
