import { render, screen } from "@testing-library/react";
import { beforeAll, afterEach, afterAll, test, expect, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { GroupeForm } from "./GroupeForm";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;
const serveur = setupServer();

beforeAll(() => serveur.listen());
afterEach(() => serveur.resetHandlers());
afterAll(() => serveur.close());

test("les données entrées par l'utilisateur sont bien envoyées lors de la soumission", async () => {
  // ARRANGE
  let requeteBody = { nom: "" };

  serveur.use(
    http.post(`${apiUrl}/api/groupes`, async (req) => {
      requeteBody = (await req.request.json()) as typeof requeteBody;
      return new HttpResponse(null, { status: 200 });
    })
  );

  vi.mock("@auth0/auth0-react", async (importOriginal) => {
    const getAccessTokenSilentlyMock = vi.fn(async () => "access_token");

    return {
      ...(await importOriginal()),
      useAuth0: vi.fn(() => ({
        getAccessTokenSilently: getAccessTokenSilentlyMock,
      })),
    };
  });

  // ACT
  render(
    <MemoryRouter initialEntries={["/messagerie"]}>
      <GroupeForm />
    </MemoryRouter>
  );

  // Récupère les éléments du formulaire
  const nomGroupeInput = screen.getByPlaceholderText("Nom du groupe");
  const soumettreButton = screen.getByRole("button", { name: "Créer" });
  // Remplit le formulaire
  await userEvent.type(nomGroupeInput, "Un groupe de test");
  // Soumet le formulaire
  await userEvent.click(soumettreButton);

  // ASSERT
  // Vérifie que le serveur a reçu les bonnes données
  expect(requeteBody.nom).toBe("Un groupe de test");
});
