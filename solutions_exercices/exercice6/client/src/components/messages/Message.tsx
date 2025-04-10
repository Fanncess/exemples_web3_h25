type Message = {
  id: number;
  nomUtilisateur: string;
  message: string;
  date: string;
};

type Props = {
  message: Message;
};

export function Message({ message }: Props) {
  const date = new Date(message.date);

  return (
    <div className="card p-2 border-4 border-warning">
      <div className="d-flex">
        <span className="fw-bold flex-fill">{message.nomUtilisateur}</span>
        <span className="fw-light text-secondary float-end d-none d-sm-inline">
          {new Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          }).format(date)}
        </span>
        <span className="fw-light text-secondary float-end d-sm-none">
          {new Intl.DateTimeFormat().format(date)}
        </span>
      </div>
      <p className="mb-0">{message.message}</p>
    </div>
  );
}
