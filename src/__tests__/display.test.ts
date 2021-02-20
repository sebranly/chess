import { Color, Piece, PieceType } from '../types';
import { getTerminalNotation, getTerminalNotationLetter } from '../display';

const { Bishop, King, Knight, Pawn, Queen, Rook } = PieceType;

test('getTerminalNotationLetter', () => {
  expect(getTerminalNotationLetter(King)).toBe('k');
  expect(getTerminalNotationLetter(Pawn)).toBe('p');
  expect(getTerminalNotationLetter(Bishop)).toBe('b');
  expect(getTerminalNotationLetter(Knight)).toBe('n');
  expect(getTerminalNotationLetter(Rook)).toBe('r');
  expect(getTerminalNotationLetter(Queen)).toBe('q');
});

test('getTerminalNotation', () => {
  const piece: Piece = {
    color: Color.White,
    hasNeverMoved: true,
    isFromPromotion: false,
    subType: undefined,
    type: PieceType.King,
  };

  expect(getTerminalNotation(piece)).toBe('K');

  piece.color = Color.Black;
  expect(getTerminalNotation(piece)).toBe('k');
});
