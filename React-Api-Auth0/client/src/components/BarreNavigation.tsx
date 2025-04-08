import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router";

export function BarreNavigation() {
  return (
    <Navbar expand="sm" className="bg-body-tertiary">
      <Container>
        <Nav.Link as={NavLink} to="/">
          Accueil
        </Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
