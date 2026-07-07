import { Chessboard } from "react-chessboard";

type ChessboardWithOptionsProps = {
  options: any;
};

export default function ChessboardWithOptions({
  options,
}: ChessboardWithOptionsProps) {
  return <Chessboard options={options} />;
}
