import { render, screen } from "@testing-library/react";
import { beforeAll, afterEach, afterAll, test, expect, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse, PathParams } from "msw";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { GroupeUtilisateurForm } from "./GroupeUtilisateurForm";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;
const serveur = setupServer();

beforeAll(() => serveur.listen());
afterEach(() => serveur.resetHandlers());
afterAll(() => serveur.close());

test("les données entrées par l'utilisateur sont bien envoyées lors de la soumission", async () => {
  // ARRANGE
  const groupe = { id: 1, nom: "Groupe 1", createurId: "1" };
  let requeteBody = "";
  let requeteParams: PathParams = {};

  serveur.use(
    http.post(`${apiUrl}/api/groupes/:groupeId/utilisateurs`, async (req) => {
      requeteParams = req.params;
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
      <GroupeUtilisateurForm groupe={groupe} show={true} onClose={() => {}} />
    </MemoryRouter>
  );

  // Récupère les éléments du formulaire
  const idUtilisateurInput = screen.getByLabelText("Id de l'utilisateur");
  const soumettreButton = screen.getByRole("button", { name: "Ajouter" });
  // Remplit le formulaire
  await userEvent.type(idUtilisateurInput, "auth0|123456789");
  // Soumet le formulaire
  await userEvent.click(soumettreButton);

  // ASSERT
  // Vérifie que le serveur a reçu les bonnes données
  expect(requeteBody).toBe("auth0|123456789");
  expect(requeteParams.groupeId).toBe("1");
});
