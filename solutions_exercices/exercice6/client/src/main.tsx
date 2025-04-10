import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "~/index.scss";
import { App } from "~/App.tsx";
import { AuthContextProvider } from "~/contexts/AuthContextProvider";
import { GroupeContextProvider } from "~/contexts/GroupeContextProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
    <GroupeContextProvider>
      <App />
    </GroupeContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
