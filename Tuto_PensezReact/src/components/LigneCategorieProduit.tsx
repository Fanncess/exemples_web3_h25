type Props = {
  categorie: string;
};

export function LigneCategorieProduit({categorie}: Props) {
  return (
    <tr className="text-center table-secondary" key={categorie}>
      <th colSpan={2}>{categorie}</th>
    </tr>
  );
}