import { Groupes } from "~/components/groupes/Groupes";
import { MessageForm } from "~/components/messages/MessageForm";
import { Messages } from "~/components/messages/Messages";

export function PageMessagerie() {
  return (
    <div className="d-flex flex-fill gap-2">
      <Groupes />
      <main className="flex-fill d-flex flex-column gap-2">
        <Messages />
        <MessageForm />
      </main>
    </div>
  );
}