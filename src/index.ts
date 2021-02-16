import { PieceType } from './types';

export const getPiecePoints = (piece: PieceType) => {
  const { Bishop, King, Knight, Pawn, Queen, Rook } = PieceType;

  switch (piece) {
    case Pawn:
      return 1;

    case Bishop:
    case Knight:
      return 3;

    case Rook:
      return 5;

    case Queen:
      return 9;

    case King:
    default:
      return 0;
  }
};

export { PieceType };
