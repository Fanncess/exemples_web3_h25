import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "~/index.scss";
import { BrowserRouter } from "react-router";
import { App } from "~/App.tsx";
import { AuthContextProvider } from "~/contexts/AuthContextProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
