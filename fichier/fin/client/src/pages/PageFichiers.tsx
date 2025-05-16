import { FichierForm } from "~/components/fichiers/FichierForm";
import { Fichiers } from "~/components/fichiers/Fichiers";

export function PageFichiers() {
  return (
    <main className="flex-fill d-flex flex-column gap-2">
      <FichierForm />
      <Fichiers />
    </main>
  );
}
