import { Board, Color, Piece, PieceSubType, PieceType, Position, Square } from './types';
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

export const getFileNumber = (file: string) => {
  return file.charCodeAt(0) - DEFAULT_ASCII_LOWERCASE_A + 1;
};

export const initializePiece = (color: Color, type = PieceType.Pawn, subType?: PieceSubType) => {
  const piece: Piece = {
    color,
    hasNeverMoved: true,
    isFromPromotion: false,
    possibleMoves: [],
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
      const position = `${fileLetter}${rank}`;
      const square: Square = { pos: position };

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

  squares.map((square: Square) => {
    const { pos } = square;
    emptySquare(board, pos);
  });

  return board;
};

export const getSquare = (board: Board, rawPosition: string) => {
  const { squares } = board;
  const square = squares.find((s: Square) => s.pos === rawPosition);

  return square;
};

export const getSquareColor = (rawPosition: string) => {
  const position = getPosition(rawPosition);

  if (!position) return Color.White;

  const { file, rank } = position;
  const fileNumber = getFileNumber(file);

  const sum = fileNumber + rank;
  const isEven = sum % 2 === 0;
  const color = isEven ? Color.Black : Color.White;

  return color;
};

export const setSquare = (board: Board, rawPosition: string, piece: Piece) => {
  const square = getSquare(board, rawPosition);

  if (square) square.piece = piece;
};

export const emptySquare = (board: Board, rawPosition: string) => {
  const square = getSquare(board, rawPosition);

  if (square) {
    const { piece } = square;
    square.piece = undefined;
    return piece;
  }
};

export const getPosition = (rawPosition: string) => {
  const regex = new RegExp(/^([A-Za-z]+)(\d+)$/);
  const matches = rawPosition.match(regex);

  if (!matches) return undefined;

  const position: Position = {
    file: matches[1].toLowerCase(),
    rank: Number(matches[2]),
  };

  return position;
};

export const getPreviousFile = (board: Board, file: string) => {
  return getPreviousOrNextFile(board, file, -1);
};

export const getNextFile = (board: Board, file: string) => {
  return getPreviousOrNextFile(board, file, 1);
};

export const isValidFile = (board: Board, fileNumber: number) => {
  const { fileCount } = board;
  return fileNumber >= 1 && fileNumber <= fileCount;
};

export const isValidRank = (board: Board, rank: number) => {
  const { rankCount } = board;
  return rank >= 1 && rank <= rankCount;
};

export const getPreviousOrNextFile = (board: Board, file: string, delta: number) => {
  const fileNumber = getFileNumber(file);
  const newFileNumber = fileNumber + delta;
  const isValid = isValidFile(board, newFileNumber);

  return isValid ? getFileLetter(newFileNumber) : undefined;
};

export const getPreviousRank = (board: Board, rank: number) => {
  return getPreviousOrNextRank(board, rank, -1);
};

export const getNextRank = (board: Board, rank: number) => {
  return getPreviousOrNextRank(board, rank, 1);
};

export const getPreviousOrNextRank = (board: Board, rank: number, delta: number) => {
  const newRank = rank + delta;
  const isValid = isValidRank(board, newRank);

  return isValid ? newRank : undefined;
};

export { PieceType };
