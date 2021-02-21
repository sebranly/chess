import { getPossibleMoves, getPossibleMovesKing } from '../moves';
import { emptySquare, initializeBoard, initializePiece, setSquare } from '../index';
import { Color, PieceType } from '../types';

test('getPossibleMoves etc.', () => {
  const board = initializeBoard(true);
  const pieceKing = initializePiece(Color.White, PieceType.King);
  setSquare(board, 'e4', pieceKing);

  const expectedMovesKing1 = [
    { file: 'd', rank: 3 },
    { file: 'e', rank: 3 },
    { file: 'f', rank: 3 },
    { file: 'd', rank: 4 },
    { file: 'f', rank: 4 },
    { file: 'd', rank: 5 },
    { file: 'e', rank: 5 },
    { file: 'f', rank: 5 },
  ];

  expect(getPossibleMoves(board, 'e4')).toStrictEqual(expectedMovesKing1);
  expect(getPossibleMovesKing(board, 'e4')).toStrictEqual(expectedMovesKing1);

  emptySquare(board, 'e4');
  setSquare(board, 'h8', pieceKing);

  const expectedMovesKing2 = [
    { file: 'g', rank: 7 },
    { file: 'h', rank: 7 },
    { file: 'g', rank: 8 },
  ];

  expect(getPossibleMoves(board, 'h8')).toStrictEqual(expectedMovesKing2);
  expect(getPossibleMovesKing(board, 'h8')).toStrictEqual(expectedMovesKing2);
});
