import { render, screen } from "@testing-library/react";
import { beforeAll, afterEach, afterAll, test, expect, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { Groupes } from "./Groupes";
import { MemoryRouter } from "react-router";

const apiUrl = import.meta.env.VITE_API_SERVER_URL;
const serveur = setupServer();

beforeAll(() => serveur.listen());
afterEach(() => serveur.resetHandlers());
afterAll(() => serveur.close());

test("affiche les groupes après chargement", async () => {
  // ARRANGE
  const groupes = [
    { id: 1, nom: "Groupe 1", createurId: "1" },
    { id: 2, nom: "Groupe 2", createurId: "2" },
  ];

  serveur.use(
    http.get(`${apiUrl}/api/groupes`, async (_req) => {
      return HttpResponse.json(groupes);
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
      <Groupes />
    </MemoryRouter>
  );

  // ASSERT
  for (let i = 0; i < groupes.length; i++) {
    expect(await screen.findByText(groupes[i].nom)).toBeVisible();
  }
});
