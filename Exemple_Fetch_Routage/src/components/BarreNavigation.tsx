import { NavLink } from "react-router";

export function BarreNavigation() {
  return (
    <nav>
      <NavLink to="/">Accueil</NavLink>{" "}
      <NavLink to="/fetch/get">GET</NavLink>{" "}
      <NavLink to="/fetch/post">POST</NavLink>
    </nav>
  );
}