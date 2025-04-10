import { GROUPES } from "~/constants/groupes";
import { Groupe } from "~/components/groupes/Groupe";

export function Groupes() {
  return (
    <nav
      id="groupes"
      className="d-flex flex-column gap-2 border border-4 border-danger p-2 rounded overflow-auto"
      style={{ minWidth: "max-content" }}
    >
      {GROUPES.map((groupe) => (
        <Groupe key={groupe.id} groupe={groupe} />
      ))}
    </nav>
  );
}