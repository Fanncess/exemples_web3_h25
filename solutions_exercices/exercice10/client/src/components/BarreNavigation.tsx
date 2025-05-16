import { useAuth0 } from "@auth0/auth0-react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router";

export function BarreNavigation() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  return (
    <Navbar expand="sm" className="bg-body-tertiary">
      <Container>
        <Nav.Link as={NavLink} to="/">
          Accueil
        </Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {!isLoading && !isAuthenticated && (
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/connexion">
                Connexion
              </Nav.Link>
              <Nav.Link as={NavLink} to="/inscription">
                Inscription
              </Nav.Link>
            </Nav>
          )}
          {!isLoading && isAuthenticated && (
            <>
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/messagerie">
                  Messagerie
                </Nav.Link>
              </Nav>
              <Nav>
                <NavDropdown title={user?.name || "Profil"} align="end">
                  <NavDropdown.Item as={NavLink} to="/profil">
                    Mon profil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={NavLink} to="/deconnexion">
                    Déconnexion
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
