export const MESSAGES = [
  [
    {
      id: 1,
      nomUtilisateur: "Alice",
      message: "Hello, world!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 0, 0)),
    },
    {
      id: 2,
      nomUtilisateur: "Bob",
      message: "Hi, there!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 1, 0)),
    },
    {
      id: 3,
      nomUtilisateur: "Alice",
      message: "How are you?",
      date: new Date(Date.UTC(2025, 1, 1, 12, 2, 0)),
    },
    {
      id: 4,
      nomUtilisateur: "Bob",
      message: "I am fine, thank you!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 3, 0)),
    },
    {
      id: 5,
      nomUtilisateur: "Alice",
      message: "Goodbye!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 4, 0)),
    },
    {
      id: 6,
      nomUtilisateur: "Bob",
      message: "See you later!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 5, 0)),
    },
  ],
  [
    {
      id: 7,
      nomUtilisateur: "Charlie",
      message: "Bonjour!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 10, 0)),
    },
    {
      id: 8,
      nomUtilisateur: "Alice",
      message: "Salut!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 11, 0)),
    },
    {
      id: 9,
      nomUtilisateur: "Charlie",
      message: "Comment ça va?",
      date: new Date(Date.UTC(2025, 1, 1, 12, 12, 0)),
    },
    {
      id: 10,
      nomUtilisateur: "Alice",
      message: "Ça va bien, merci!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 13, 0)),
    },
    {
      id: 11,
      nomUtilisateur: "Charlie",
      message: "Au revoir!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 14, 0)),
    },
    {
      id: 12,
      nomUtilisateur: "Alice",
      message: "À plus tard!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 15, 0)),
    },
  ],
  [
    {
      id: 13,
      nomUtilisateur: "David",
      message: "Hola!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 20, 0)),
    },
    {
      id: 14,
      nomUtilisateur: "Alice",
      message: "Hola!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 21, 0)),
    },
    {
      id: 15,
      nomUtilisateur: "David",
      message: "¿Cómo estás?",
      date: new Date(Date.UTC(2025, 1, 1, 12, 22, 0)),
    },
    {
      id: 16,
      nomUtilisateur: "Alice",
      message: "Estoy bien, ¡gracias!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 23, 0)),
    },
    {
      id: 17,
      nomUtilisateur: "David",
      message: "¡Adiós!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 24, 0)),
    },
    {
      id: 18,
      nomUtilisateur: "Alice",
      message: "¡Hasta luego!",
      date: new Date(Date.UTC(2025, 1, 1, 12, 25, 0)),
    },
  ],
];

let prochainMessageId = MESSAGES.flat().length + 1;

/**
 * Simule le GET de message avec fetch qui prend 1 seconde.
 */
export function simulerFecthGetMessage(groupeId: number) {
  return new Promise<Response>((resolve) =>
    setTimeout(() => {
      // Retourne une erreur 404 Not Found si le groupe n'existe pas
      if (!MESSAGES[groupeId]) {
        return resolve(new Response(null, { status: 404 }));
      }

      // Retourne une réponse 200 Ok avec les messages si tout s'est bien passé
      resolve(
        new Response(JSON.stringify(MESSAGES[groupeId]), { status: 200 })
      );
    }, 1000)
  );
}

/**
 * Simule le POST de message avec fetch qui prend 1 seconde.
 * Si le message est "erreur", retourne un 400 Bad Request.
 */
export function simulerFecthPostMessage(
  texteMessage: string,
  nomUtilisateur: string,
  groupeId: number
) {
  return new Promise<Response>((resolve) =>
    setTimeout(() => {
      // Retourne une erreur 400 Bad Request si le message est "erreur"
      if (texteMessage === "erreur") {
        return resolve(new Response(null, { status: 400 }));
      }

      // Retourne une erreur 404 Not Found si le groupe n'existe pas
      if (!MESSAGES[groupeId]) {
        return resolve(new Response(null, { status: 404 }));
      }

      // Simule la création d'un nouveau message dans la base de données par l'API
      const nouveauMessage = {
        id: prochainMessageId++,
        nomUtilisateur: nomUtilisateur,
        message: texteMessage,
        date: new Date(),
      };
      MESSAGES[groupeId].push(nouveauMessage);

      // Retourne une réponse 201 Created avec le nouveau message si tout s'est bien passé
      resolve(new Response(JSON.stringify(nouveauMessage), { status: 201 }));
    }, 1000)
  );
}