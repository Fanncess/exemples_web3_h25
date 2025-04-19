import { render, screen } from "@testing-library/react";
import { beforeAll, afterEach, afterAll, test, expect, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse, PathParams } from "msw";
import userEvent from "@testing-library/user-event";
import { MessageForm } from "./MessageForm";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;
const serveur = setupServer();

beforeAll(() => serveur.listen());
afterEach(() => serveur.resetHandlers());
afterAll(() => serveur.close());

test("les données entrées par l'utilisateur sont bien envoyées lors de la soumission", async () => {
  // ARRANGE
  let requeteBody = { texte: "", nomUtilisateur: "" };
  let requeteParams: PathParams = {};

  serveur.use(
    http.post(`${apiUrl}/api/groupes/:groupeId/messages`, async (req) => {
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
        user: { name: "Utilisateur de test" },
      })),
    };
  });

  vi.mock("react-router", async (importOriginal) => {
    return {
      ...(await importOriginal()),
      useParams: vi.fn(() => ({ groupeId: 1 })),
    };
  });

  // ACT
  render(<MessageForm />);

  // Récupère les éléments du formulaire
  const messageInput = screen.getByPlaceholderText("Message");
  const soumettreButton = screen.getByRole("button", { name: "Envoyer" });
  // Remplit le formulaire
  await userEvent.type(messageInput, "Un message de test");
  // Soumet le formulaire
  await userEvent.click(soumettreButton);

  // ASSERT
  // Vérifie que le serveur a reçu les bonnes données
  expect(requeteBody).toStrictEqual({
    texte: "Un message de test",
    nomUtilisateur: "Utilisateur de test",
  });
  expect(requeteParams.groupeId).toBe("1");
});
