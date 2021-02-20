import { Board, Color, Piece, PieceSubType, PieceType, Square } from './types';
import { DEFAULT_ASCII_LOWERCASE_A, DEFAULT_FILE_COUNT, DEFAULT_RANK_COUNT } from './constants';

export const getPiecePoints = (pieceType: PieceType) => {
  const { Bishop, King, Knight, Pawn, Queen, Rook } = PieceType;

  switch (pieceType) {
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

export const getFileLetter = (fileNumber: number) => {
  if (fileNumber >= 1) {
    const fileLetter = String.fromCharCode(fileNumber - 1 + DEFAULT_ASCII_LOWERCASE_A);
    return fileLetter;
  }

  return '';
};

export const initializePiece = (color: Color, type = PieceType.Pawn, subType?: PieceSubType) => {
  const piece: Piece = {
    color,
    hasNeverMoved: true,
    isFromPromotion: false,
    subType,
    type,
  };

  return piece;
};

export const getFileBasedPieceType = (file: number, fileCount = DEFAULT_FILE_COUNT) => {
  const { Bishop, King, Knight, Queen, Rook } = PieceType;

  if ([1, fileCount].includes(file)) return Rook;
  if ([2, fileCount - 1].includes(file)) return Knight;
  if ([3, fileCount - 2].includes(file)) return Bishop;
  if (file === 4) return Queen;
  if (file === fileCount - 3) return King;

  return undefined;
};

export const getFileBasedPieceSubType = (file: number, fileCount = DEFAULT_FILE_COUNT) => {
  const { West, East } = PieceSubType;

  if (file <= 3) return West;
  if (file > fileCount - 3) return East;

  return undefined;
};

export const initializeBoard = (empty = false, fileCount = DEFAULT_FILE_COUNT, rankCount = DEFAULT_RANK_COUNT) => {
  const board: Board = { squares: [], fileCount, rankCount };

  for (let file = 1; file <= fileCount; file++) {
    for (let rank = 1; rank <= rankCount; rank++) {
      const fileLetter = getFileLetter(file);
      const square: Square = { file: fileLetter, rank };

      if (!empty) {
        if ([1, rankCount].includes(rank)) {
          const color = rank === 1 ? Color.White : Color.Black;
          const pieceType = getFileBasedPieceType(file);
          const pieceSubType = getFileBasedPieceSubType(file);
          square.piece = initializePiece(color, pieceType, pieceSubType);
        }

        if ([2, rankCount - 1].includes(rank)) {
          const color = rank === 2 ? Color.White : Color.Black;
          square.piece = initializePiece(color);
        }
      }

      board.squares.push(square);
    }
  }

  return board;
};

export const emptyBoard = (board: Board) => {
  const { squares } = board;

  squares.map((s: Square) => (s.piece = undefined));

  return board;
};

export const getSquare = (board: Board, file: string, rank: number) => {
  const { squares } = board;
  const square = squares.find((s: Square) => s.file === file && s.rank === rank);

  return square;
};

export const setSquare = (board: Board, file: string, rank: number, piece: Piece) => {
  const square = getSquare(board, file, rank);

  if (square) square.piece = piece;
};

export { PieceType };
