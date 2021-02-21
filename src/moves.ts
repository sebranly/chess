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
} from './index';

export const getPossibleMoves = (board: Board, rawPosition: string): Position[] => {
  const square = getSquare(board, rawPosition);

  if (!square) return [];

  const { piece } = square;

  if (!piece) return [];

  const { color, type } = piece;

  switch (type) {
    case PieceType.King:
      return getPossibleMovesKing(board, rawPosition, color);

    default:
      return [];
  }
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
