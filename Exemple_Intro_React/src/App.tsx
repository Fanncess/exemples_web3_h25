import { useState } from "react";
import "./App.css";
import { MessageBravo } from "~/components/MessageBravo";
import { BoutonCompteur } from "./components/BoutonCompteur";

export function App() {
  const [compte, setCompte] = useState(42);

  return (
    <>
      {compte >= 50 && <MessageBravo />}
      <BoutonCompteur compte={compte} setCompte={setCompte} />
    </>
  );
}
