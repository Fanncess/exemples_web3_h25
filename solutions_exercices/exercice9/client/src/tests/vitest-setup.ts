import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Après chaque test, vide l'arbre React (populé avec render).
// Permet d'isoler les tests.
afterEach(() => {
  cleanup();
});