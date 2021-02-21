import { getPossibleMoves, getPossibleMovesKing } from '../moves';
import { initializeBoard, initializePiece, setSquare } from '../index';
import { Color, PieceType } from '../types';

test('getPossibleMoves and suffix', () => {
  const board = initializeBoard(true);
  const pieceKing = initializePiece(Color.White, PieceType.King);
  setSquare(board, 'e4', pieceKing);

  const expectedMovesKing = [
    { file: 'd', rank: 3 },
    { file: 'e', rank: 3 },
    { file: 'f', rank: 3 },
    { file: 'd', rank: 4 },
    { file: 'f', rank: 4 },
    { file: 'd', rank: 5 },
    { file: 'e', rank: 5 },
    { file: 'f', rank: 5 },
  ];

  expect(getPossibleMoves(board, 'e4')).toStrictEqual(expectedMovesKing);
  expect(getPossibleMovesKing(board, 'e4')).toStrictEqual(expectedMovesKing);
});
