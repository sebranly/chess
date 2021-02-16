import { getPiecePoints } from '../index';
import { PieceType } from '../types';

test('getPiecePoints', () => {
  const { Bishop, King, Knight, Pawn, Queen, Rook } = PieceType;

  expect(getPiecePoints(King)).toBe(0);
  expect(getPiecePoints(Pawn)).toBe(1);
  expect(getPiecePoints(Bishop)).toBe(3);
  expect(getPiecePoints(Knight)).toBe(3);
  expect(getPiecePoints(Rook)).toBe(5);
  expect(getPiecePoints(Queen)).toBe(9);
});
