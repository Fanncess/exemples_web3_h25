import { render, screen } from "@testing-library/react";
import { beforeAll, afterEach, afterAll, test, expect, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse, PathParams } from "msw";
import { Messages } from "./Messages";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;
const serveur = setupServer();

beforeAll(() => serveur.listen());
afterEach(() => serveur.resetHandlers());
afterAll(() => serveur.close());

test("affiche les messages après chargement", async () => {
  // ARRANGE
  const messages = [
    { id: 1, texte: "Message 1", nomUtilisateur: "Utilisateur 1", dateAjout: "2023-10-01T12:00:00Z", fichiers: [] },
    { id: 2, texte: "Message 2", nomUtilisateur: "Utilisateur 2", dateAjout: "2023-10-02T12:00:00Z", fichiers: [] },
  ];
  let requeteParams: PathParams = {};

  serveur.use(
    http.get(`${apiUrl}/api/groupes/:groupeId/messages`, async (req) => {
      requeteParams = req.params;
      return HttpResponse.json(messages);
    })
  );

  vi.mock("@auth0/auth0-react", async (importOriginal) => {
    // Important de déclarer getAccessTokenSilently ici,
    // sinon on a des boucles infinies lorsqu'il est dans
    // les dépendances d'un useEffect
    const getAccessTokenSilentlyMock = vi.fn(async () => "access_token");

    return {
      ...(await importOriginal()),
      useAuth0: vi.fn(() => ({
        getAccessTokenSilently: getAccessTokenSilentlyMock,
      })),
    };
  });

  vi.mock("react-router", async (importOriginal) => {
    return {
      ...(await importOriginal()),
      useParams: vi.fn(() => ({ groupeId: 1 })),
    };
  });

  window.HTMLElement.prototype.scrollTo = vi.fn();

  // ACT
  render(<Messages />);

  // ASSERT
  for (let i = 0; i < messages.length; i++) {
    expect(await screen.findByText(messages[i].texte)).toBeVisible();
  }
  expect(requeteParams.groupeId).toBe("1");
});
