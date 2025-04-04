type Props = {
    value: string | null;
    onSquareClick: () => void;
}

export function Square({ value, onSquareClick }: Props) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}