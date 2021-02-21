import { Board, Color, PieceType, Position } from './types';
import {
  getPosition,
  getPreviousFile,
  getSquare,
  getNextFile,
  getPreviousRank,
  getNextRank,
  getFileNumber,
  getFileLetter,
  isValidFile,
  isValidRank,
} from './index';

export const getPossibleMoves = (board: Board, rawPosition: string): Position[] => {
  const square = getSquare(board, rawPosition);
  const { Bishop, King, Queen, Rook } = PieceType;

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

  // TODO: factorize?
  const pieceColor = square?.piece?.color;
  const pieceType = square?.piece?.type;
  const canMoveCauseEmpty = !pieceColor || !pieceType;
  const canTake = pieceColor && pieceColor !== color && pieceType !== PieceType.King;
  const canMove = canMoveCauseEmpty || canTake;

  if (canMove) {
    const newMove = { file: newFile, rank: newRank };
    const newPossibleMoves = [...possibleMoves, newMove];

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

        const pieceColor = square?.piece?.color;
        const pieceType = square?.piece?.type;
        const canMove = !pieceColor || !pieceType || (pieceColor !== color && pieceType !== PieceType.King);

        if (canMove) {
          moves.push({ file: fileLetter, rank: rankIndex });
        }
      }
    }
  }

  return moves;
};
