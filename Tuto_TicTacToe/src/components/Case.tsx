type Props = {
  valeur: string;
  onClick: () => void;
};

export function Case({valeur, onClick}: Props) {
  return (
    <td className="p-0">
      <button
        className="btn btn-light rounded-0 case text-center fw-bold lh-1 fs-5"
        style={{ width: "2.5rem", height: "2.5rem" }}
        onClick={onClick}
      >
        {valeur}
      </button>
    </td>
  );
}
