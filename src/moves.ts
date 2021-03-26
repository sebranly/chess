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

// TODO: rework allowKingCapture

export const isInCheck = (board: Board, color: Color) => {
  const { squares } = board;

  let foundCheck = false;

  for (let i = 0; i < squares.length && !foundCheck; i++) {
    const square = squares[i];

    const { file, piece, rank } = square;
    const rawPosition = `${file}${rank}`;

    if (piece && piece.color !== color && piece.type !== PieceType.King) {
      const moves = getMoves(board, rawPosition, true);

      const checkMove = moves.find((move) => {
        const { file: fileMove, rank: rankMove } = move;
        const rawPositionMove = `${fileMove}${rankMove}`;
        const squareMove = getSquare(board, rawPositionMove);

        if (!squareMove) return false;

        const { piece } = squareMove;

        if (!piece) return false;

        return piece.type === PieceType.King && piece.color === color;
      });

      if (checkMove) foundCheck = true;
    }
  }

  return foundCheck;
};

export const getMoves = (board: Board, rawPosition: string, allowKingCapture = false): Position[] => {
  const square = getSquare(board, rawPosition);
  const { Bishop, King, Knight, Pawn, Queen, Rook } = PieceType;

  if (!square) return [];

  const { piece } = square;

  if (!piece) return [];

  const { color, type } = piece;

  switch (type) {
    case Bishop:
      return getMovesBishop(board, rawPosition, color, allowKingCapture);

    case Pawn:
      return getMovesPawn(board, rawPosition, color, allowKingCapture);

    case Queen:
      return getMovesQueen(board, rawPosition, color, allowKingCapture);

    case King:
      return getMovesKing(board, rawPosition, color, allowKingCapture);

    case Knight:
      return getMovesKnight(board, rawPosition, color, allowKingCapture);

    case Rook:
      return getMovesRook(board, rawPosition, color, allowKingCapture);

    default:
      return [];
  }
};

export const getMovesBishop = (
  board: Board,
  rawPosition: string,
  color: Color,
  allowKingCapture = false,
): Position[] => {
  const moves = [
    ...getMovesDeltas(board, color, rawPosition, -1, 1, -1, 1, [], allowKingCapture),
    ...getMovesDeltas(board, color, rawPosition, 1, 1, 1, 1, [], allowKingCapture),
    ...getMovesDeltas(board, color, rawPosition, 1, -1, 1, -1, [], allowKingCapture),
    ...getMovesDeltas(board, color, rawPosition, -1, -1, -1, -1, [], allowKingCapture),
  ];

  return moves;
};

export const getMovesRook = (board: Board, rawPosition: string, color: Color, allowKingCapture = false): Position[] => {
  const moves = [
    ...getMovesDeltas(board, color, rawPosition, 0, 1, 0, 1, [], allowKingCapture),
    ...getMovesDeltas(board, color, rawPosition, 1, 0, 1, 0, [], allowKingCapture),
    ...getMovesDeltas(board, color, rawPosition, 0, -1, 0, -1, [], allowKingCapture),
    ...getMovesDeltas(board, color, rawPosition, -1, 0, -1, 0, [], allowKingCapture),
  ];

  return moves;
};

export const getMovesQueen = (
  board: Board,
  rawPosition: string,
  color: Color,
  allowKingCapture = false,
): Position[] => {
  const moves = [
    ...getMovesBishop(board, rawPosition, color, allowKingCapture),
    ...getMovesRook(board, rawPosition, color, allowKingCapture),
  ];

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
  allowKingCapture = false,
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

  const canMoveOrTake = canMoveOrTakePiece(color, square, allowKingCapture);
  if (canMoveOrTake) {
    const newMove = { file: newFile, rank: newRank };
    const newPossibleMoves = [...possibleMoves, newMove];

    const canTake = canTakePiece(color, square, allowKingCapture);
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
      allowKingCapture,
    );
  }

  return possibleMoves;
};

export const getMovesKnight = (
  board: Board,
  rawPosition: string,
  color: Color,
  allowKingCapture = false,
): Position[] => {
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

  addMovesIfValid(board, moves, color, previousFile2, nextRank, canMoveOrTakePiece, allowKingCapture);
  addMovesIfValid(board, moves, color, previousFile, nextRank2, canMoveOrTakePiece, allowKingCapture);
  addMovesIfValid(board, moves, color, nextFile, nextRank2, canMoveOrTakePiece, allowKingCapture);
  addMovesIfValid(board, moves, color, nextFile2, nextRank, canMoveOrTakePiece, allowKingCapture);
  addMovesIfValid(board, moves, color, previousFile2, previousRank, canMoveOrTakePiece, allowKingCapture);
  addMovesIfValid(board, moves, color, previousFile, previousRank2, canMoveOrTakePiece, allowKingCapture);
  addMovesIfValid(board, moves, color, nextFile, previousRank2, canMoveOrTakePiece, allowKingCapture);
  addMovesIfValid(board, moves, color, nextFile2, previousRank, canMoveOrTakePiece, allowKingCapture);

  return moves;
};

// TODO: code en-passant
// TODO: code promotion
export const getMovesPawn = (board: Board, rawPosition: string, color: Color, allowKingCapture = false): Position[] => {
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

  const isValid = addMovesIfValid(board, moves, color, file, rank1, canMovePiece, allowKingCapture);
  addMovesIfValid(board, moves, color, previousFile, rank1, canTakePiece, allowKingCapture);
  addMovesIfValid(board, moves, color, nextFile, rank1, canTakePiece, allowKingCapture);

  // TODO: create a function with unit tests
  const isInitialRank = (isWhite && rank === 2) || (!isWhite && rank === rankCount - 2);
  if (isValid && isInitialRank) {
    addMovesIfValid(board, moves, color, file, rank2, canMovePiece, allowKingCapture);
  }

  return moves;
};

// TODO: code castle
export const getMovesKing = (board: Board, rawPosition: string, color: Color, allowKingCapture = false): Position[] => {
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
        const canMoveOrTake = canMoveOrTakePiece(color, square, allowKingCapture);

        if (canMoveOrTake) {
          moves.push({ file: fileLetter, rank: rankIndex });
        }
      }
    }
  }

  return moves;
};

// TODO: add unit tests
export const canMoveOrTakePiece = (color: Color, square: Square | undefined, allowKingCapture = false) => {
  const canMove = canMovePiece(square);
  const canTake = canTakePiece(color, square, allowKingCapture);

  const canMoveOrTake = canMove || canTake;

  return canMoveOrTake;
};

// TODO: add unit tests
export const canTakePiece = (color: Color, square: Square | undefined, allowKingCapture = false) => {
  const pieceColor = square?.piece?.color;
  const pieceType = square?.piece?.type;

  const kingCondition = allowKingCapture ? true : pieceType !== PieceType.King;
  const canTake = pieceColor && pieceColor !== color && kingCondition;

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
  allowKingCapture = false,
) => {
  if (!fileLetter || !rankIndex) return false;

  const rawPosition = `${fileLetter}${rankIndex}`;
  const square = getSquare(board, rawPosition);

  const args = verificationFunction === canMovePiece ? [square] : [color, square, allowKingCapture];

  const isValid = verificationFunction(...args);

  if (!isValid) return false;

  const newMove: Position = { file: fileLetter, rank: rankIndex };

  moves.push(newMove);

  return true;
};
