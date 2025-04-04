import { Groupes } from "~/components/groupes/Groupes";
import { Messages } from "~/components/messages/Messages";
import { MessageForm } from "~/components/messages/MessageForm";

export function App() {
  return (
    <div className="d-flex vh-100 vw-100 p-2 gap-2 rounded border border-4 border-info">
      <Groupes />
      <main className="flex-fill d-flex flex-column gap-2">
        <Messages />
        <MessageForm />
      </main>
    </div>
  );
}
