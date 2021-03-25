import { Board, Color, PieceType, Position, Square } from './types';
import {
  getPosition,
  getPreviousFile,
  getSquare,
  getNextFile,
  getPreviousRank,
  getPreviousOrNextFile,
  getPreviousOrNextRank,
  getNextRank,
  getFileNumber,
  getFileLetter,
  isValidFile,
  isValidRank,
} from './index';

export const getPossibleMoves = (board: Board, rawPosition: string): Position[] => {
  const square = getSquare(board, rawPosition);
  const { Bishop, King, Knight, Queen, Rook } = PieceType;

  if (!square) return [];

  const { piece } = square;

  if (!piece) return [];

  const { color, type } = piece;

  switch (type) {
    case Bishop:
      return getPossibleMovesBishop(board, rawPosition, color);

    case Queen:
      return getPossibleMovesQueen(board, rawPosition, color);

    case King:
      return getPossibleMovesKing(board, rawPosition, color);

    case Knight:
      return getPossibleMovesKnight(board, rawPosition, color);

    case Rook:
      return getPossibleMovesRook(board, rawPosition, color);

    default:
      return [];
  }
};

export const getPossibleMovesBishop = (board: Board, rawPosition: string, color: Color): Position[] => {
  const moves = [
    ...getPossibleMovesDeltas(board, color, rawPosition, -1, 1),
    ...getPossibleMovesDeltas(board, color, rawPosition, 1, 1),
    ...getPossibleMovesDeltas(board, color, rawPosition, 1, -1),
    ...getPossibleMovesDeltas(board, color, rawPosition, -1, -1),
  ];

  return moves;
};

export const getPossibleMovesRook = (board: Board, rawPosition: string, color: Color): Position[] => {
  const moves = [
    ...getPossibleMovesDeltas(board, color, rawPosition, 0, 1),
    ...getPossibleMovesDeltas(board, color, rawPosition, 1, 0),
    ...getPossibleMovesDeltas(board, color, rawPosition, 0, -1),
    ...getPossibleMovesDeltas(board, color, rawPosition, -1, 0),
  ];

  return moves;
};

export const getPossibleMovesQueen = (board: Board, rawPosition: string, color: Color): Position[] => {
  const moves = [
    ...getPossibleMovesBishop(board, rawPosition, color),
    ...getPossibleMovesRook(board, rawPosition, color),
  ];

  return moves;
};

// TODO: add unit tests
export const getPossibleMovesDeltas = (
  board: Board,
  color: Color,
  rawPosition: string,
  deltaFileStep: number,
  deltaRankStep: number,
  deltaFile = deltaFileStep,
  deltaRank = deltaRankStep,
  possibleMoves: Position[] = [],
): Position[] => {
  const position = getPosition(rawPosition);

  if (!position) return [];

  const { file, rank } = position;

  const fileNumber = getFileNumber(file);
  const newFileNumber = fileNumber + deltaFile;
  const newRank = rank + deltaRank;

  const isValid = isValidFile(board, newFileNumber) && isValidRank(board, newRank);
  if (!isValid) return possibleMoves;

  const newFile = getFileLetter(newFileNumber);
  const newPosition = `${newFile}${newRank}`;

  const square = getSquare(board, newPosition);

  const canMove = canMovePiece(color, square);
  if (canMove) {
    const newMove = { file: newFile, rank: newRank };
    const newPossibleMoves = [...possibleMoves, newMove];

    const canTake = canTakePiece(color, square);
    if (canTake) return newPossibleMoves;

    return getPossibleMovesDeltas(
      board,
      color,
      rawPosition,
      deltaFileStep,
      deltaRankStep,
      deltaFile + deltaFileStep,
      deltaRank + deltaRankStep,
      newPossibleMoves,
    );
  }

  return possibleMoves;
};

export const getPossibleMovesKnight = (board: Board, rawPosition: string, color: Color): Position[] => {
  const position = getPosition(rawPosition);

  if (!position) return [];

  const { file, rank } = position;

  const moves: Position[] = [];

  const previousFile = getPreviousFile(board, file);
  const nextFile = getNextFile(board, file);

  const previousFile2 = getPreviousOrNextFile(board, file, -2);
  const nextFile2 = getPreviousOrNextFile(board, file, 2);

  const previousRank = getPreviousRank(board, rank);
  const nextRank = getNextRank(board, rank);

  const previousRank2 = getPreviousOrNextRank(board, rank, -2);
  const nextRank2 = getPreviousOrNextRank(board, rank, 2);

  addMovesIfValid(board, moves, color, previousFile2, nextRank);
  addMovesIfValid(board, moves, color, previousFile, nextRank2);
  addMovesIfValid(board, moves, color, nextFile, nextRank2);
  addMovesIfValid(board, moves, color, nextFile2, nextRank);
  addMovesIfValid(board, moves, color, previousFile2, previousRank);
  addMovesIfValid(board, moves, color, previousFile, previousRank2);
  addMovesIfValid(board, moves, color, nextFile, previousRank2);
  addMovesIfValid(board, moves, color, nextFile2, previousRank);

  return moves;
};

export const getPossibleMovesKing = (board: Board, rawPosition: string, color: Color): Position[] => {
  const position = getPosition(rawPosition);

  if (!position) return [];

  const { file, rank } = position;

  const previousFile = getPreviousFile(board, file);
  const nextFile = getNextFile(board, file);

  const previousRank = getPreviousRank(board, rank);
  const nextRank = getNextRank(board, rank);

  const minFile = previousFile || file;
  const maxFile = nextFile || file;

  const minRank = previousRank || rank;
  const maxRank = nextRank || rank;

  const minFileNumber = getFileNumber(minFile);
  const maxFileNumber = getFileNumber(maxFile);

  const moves: Position[] = [];

  const fileNumber = getFileNumber(file);

  for (let rankIndex = minRank; rankIndex <= maxRank; rankIndex++) {
    for (let fileIndex = minFileNumber; fileIndex <= maxFileNumber; fileIndex++) {
      const isOnKingPosition = fileIndex === fileNumber && rankIndex === rank;
      if (!isOnKingPosition) {
        const fileLetter = getFileLetter(fileIndex);
        const rawPosition = `${fileLetter}${rankIndex}`;
        const square = getSquare(board, rawPosition);
        const canMove = canMovePiece(color, square);

        if (canMove) {
          moves.push({ file: fileLetter, rank: rankIndex });
        }
      }
    }
  }

  return moves;
};

// TODO: add unit tests
export const canMovePiece = (color: Color, square: Square | undefined) => {
  const pieceColor = square?.piece?.color;
  const pieceType = square?.piece?.type;

  const canTake = canTakePiece(color, square);
  const canMove = !pieceColor || !pieceType || canTake;

  return canMove;
};

// TODO: add unit tests
export const canTakePiece = (color: Color, square: Square | undefined) => {
  const pieceColor = square?.piece?.color;
  const pieceType = square?.piece?.type;

  const canTake = pieceColor && pieceColor !== color && pieceType !== PieceType.King;

  return canTake;
};

// TODO: add unit tests
// TODO: make it immutable
export const addMovesIfValid = (
  board: Board,
  moves: Position[],
  color: Color,
  fileLetter: string | undefined,
  rankIndex: number | undefined,
) => {
  if (!fileLetter || !rankIndex) return;

  const rawPosition = `${fileLetter}${rankIndex}`;
  const square = getSquare(board, rawPosition);

  const canMove = canMovePiece(color, square);

  if (!canMove) return;

  const newMove: Position = { file: fileLetter, rank: rankIndex };

  moves.push(newMove);
};
