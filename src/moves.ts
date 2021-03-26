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

export const getMoves = (board: Board, rawPosition: string): Position[] => {
  const square = getSquare(board, rawPosition);
  const { Bishop, King, Knight, Pawn, Queen, Rook } = PieceType;

  if (!square) return [];

  const { piece } = square;

  if (!piece) return [];

  const { color, type } = piece;

  switch (type) {
    case Bishop:
      return getMovesBishop(board, rawPosition, color);

    case Pawn:
      return getMovesPawn(board, rawPosition, color);

    case Queen:
      return getMovesQueen(board, rawPosition, color);

    case King:
      return getMovesKing(board, rawPosition, color);

    case Knight:
      return getMovesKnight(board, rawPosition, color);

    case Rook:
      return getMovesRook(board, rawPosition, color);

    default:
      return [];
  }
};

export const getMovesBishop = (board: Board, rawPosition: string, color: Color): Position[] => {
  const moves = [
    ...getMovesDeltas(board, color, rawPosition, -1, 1),
    ...getMovesDeltas(board, color, rawPosition, 1, 1),
    ...getMovesDeltas(board, color, rawPosition, 1, -1),
    ...getMovesDeltas(board, color, rawPosition, -1, -1),
  ];

  return moves;
};

export const getMovesRook = (board: Board, rawPosition: string, color: Color): Position[] => {
  const moves = [
    ...getMovesDeltas(board, color, rawPosition, 0, 1),
    ...getMovesDeltas(board, color, rawPosition, 1, 0),
    ...getMovesDeltas(board, color, rawPosition, 0, -1),
    ...getMovesDeltas(board, color, rawPosition, -1, 0),
  ];

  return moves;
};

export const getMovesQueen = (board: Board, rawPosition: string, color: Color): Position[] => {
  const moves = [...getMovesBishop(board, rawPosition, color), ...getMovesRook(board, rawPosition, color)];

  return moves;
};

// TODO: add unit tests
export const getMovesDeltas = (
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

  const canMoveOrTake = canMoveOrTakePiece(color, square);
  if (canMoveOrTake) {
    const newMove = { file: newFile, rank: newRank };
    const newPossibleMoves = [...possibleMoves, newMove];

    const canTake = canTakePiece(color, square);
    if (canTake) return newPossibleMoves;

    return getMovesDeltas(
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

export const getMovesKnight = (board: Board, rawPosition: string, color: Color): Position[] => {
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

  addMovesIfValid(board, moves, color, previousFile2, nextRank, canMoveOrTakePiece);
  addMovesIfValid(board, moves, color, previousFile, nextRank2, canMoveOrTakePiece);
  addMovesIfValid(board, moves, color, nextFile, nextRank2, canMoveOrTakePiece);
  addMovesIfValid(board, moves, color, nextFile2, nextRank, canMoveOrTakePiece);
  addMovesIfValid(board, moves, color, previousFile2, previousRank, canMoveOrTakePiece);
  addMovesIfValid(board, moves, color, previousFile, previousRank2, canMoveOrTakePiece);
  addMovesIfValid(board, moves, color, nextFile, previousRank2, canMoveOrTakePiece);
  addMovesIfValid(board, moves, color, nextFile2, previousRank, canMoveOrTakePiece);

  return moves;
};

// TODO: code en-passant
export const getMovesPawn = (board: Board, rawPosition: string, color: Color): Position[] => {
  const position = getPosition(rawPosition);

  if (!position) return [];

  const { file, rank } = position;

  const moves: Position[] = [];

  const isWhite = color === Color.White;
  const getDifferentRank = isWhite ? getNextRank : getPreviousRank;
  const multiplierRank2 = isWhite ? 1 : -1;

  const rank1 = getDifferentRank(board, rank);
  const previousFile = getPreviousFile(board, file);
  const nextFile = getNextFile(board, file);

  // TODO: find a name for -2, +2 instead as common (pawn and knight)
  const rank2 = getPreviousOrNextRank(board, rank, multiplierRank2 * 2);

  const { rankCount } = board;

  const isValid = addMovesIfValid(board, moves, color, file, rank1, canMovePiece);
  addMovesIfValid(board, moves, color, previousFile, rank1, canTakePiece);
  addMovesIfValid(board, moves, color, nextFile, rank1, canTakePiece);

  // TODO: create a function
  const isInitialRank = (isWhite && rank === 2) || (!isWhite && rank === rankCount - 2);
  if (isValid && isInitialRank) {
    addMovesIfValid(board, moves, color, file, rank2, canMovePiece);
  }

  return moves;
};

// TODO: code castle
export const getMovesKing = (board: Board, rawPosition: string, color: Color): Position[] => {
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
        const canMoveOrTake = canMoveOrTakePiece(color, square);

        if (canMoveOrTake) {
          moves.push({ file: fileLetter, rank: rankIndex });
        }
      }
    }
  }

  return moves;
};

// TODO: add unit tests
export const canMoveOrTakePiece = (color: Color, square: Square | undefined) => {
  const canMove = canMovePiece(square);
  const canTake = canTakePiece(color, square);

  const canMoveOrTake = canMove || canTake;

  return canMoveOrTake;
};

// TODO: add unit tests
export const canTakePiece = (color: Color, square: Square | undefined) => {
  const pieceColor = square?.piece?.color;
  const pieceType = square?.piece?.type;

  const canTake = pieceColor && pieceColor !== color && pieceType !== PieceType.King;

  return canTake;
};

// TODO: add unit tests
export const canMovePiece = (square: Square | undefined) => {
  const pieceColor = square?.piece?.color;
  const pieceType = square?.piece?.type;

  const canMove = !pieceColor || !pieceType;

  return canMove;
};

// TODO: add unit tests
// TODO: make it immutable
export const addMovesIfValid = (
  board: Board,
  moves: Position[],
  color: Color,
  fileLetter: string | undefined,
  rankIndex: number | undefined,
  verificationFunction: any,
) => {
  if (!fileLetter || !rankIndex) return false;

  const rawPosition = `${fileLetter}${rankIndex}`;
  const square = getSquare(board, rawPosition);

  const args = verificationFunction === canMovePiece ? [square] : [color, square];

  const isValid = verificationFunction(...args);

  if (!isValid) return false;

  const newMove: Position = { file: fileLetter, rank: rankIndex };

  moves.push(newMove);

  return true;
};
