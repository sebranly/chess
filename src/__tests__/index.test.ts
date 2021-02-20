import {
  getCell,
  getFileBasedPieceType,
  getFileBasedPieceSubType,
  getFileLetter,
  getPiecePoints,
  emptyBoard,
  initializeBoard,
  initializePiece,
} from '../index';
import { Cell, Color, Piece, PieceSubType, PieceType } from '../types';

const { Bishop, King, Knight, Pawn, Queen, Rook } = PieceType;

test('getPiecePoints', () => {
  expect(getPiecePoints(King)).toBe(0);
  expect(getPiecePoints(Pawn)).toBe(1);
  expect(getPiecePoints(Bishop)).toBe(3);
  expect(getPiecePoints(Knight)).toBe(3);
  expect(getPiecePoints(Rook)).toBe(5);
  expect(getPiecePoints(Queen)).toBe(9);
});

test('getFileLetter', () => {
  expect(getFileLetter(0)).toBe('');
  expect(getFileLetter(1)).toBe('a');
  expect(getFileLetter(8)).toBe('h');
  expect(getFileLetter(26)).toBe('z');
});

test('initializePiece', () => {
  const whitePawn = initializePiece(Color.White);
  const expectedWhitePawn: Piece = {
    color: Color.White,
    hasNeverMoved: true,
    isFromPromotion: false,
    subType: undefined,
    type: PieceType.Pawn,
  };

  expect(whitePawn).toStrictEqual(expectedWhitePawn);

  const eastBlackRook = initializePiece(Color.Black, PieceType.Rook, PieceSubType.East);
  const expectedEastBlackRook: Piece = {
    color: Color.Black,
    hasNeverMoved: true,
    isFromPromotion: false,
    subType: PieceSubType.East,
    type: PieceType.Rook,
  };

  expect(eastBlackRook).toStrictEqual(expectedEastBlackRook);
});

test('getFileBasedPieceType', () => {
  expect(getFileBasedPieceType(1)).toBe(Rook);
  expect(getFileBasedPieceType(2)).toBe(Knight);
  expect(getFileBasedPieceType(3)).toBe(Bishop);
  expect(getFileBasedPieceType(4)).toBe(Queen);
  expect(getFileBasedPieceType(5)).toBe(King);
  expect(getFileBasedPieceType(6)).toBe(Bishop);
  expect(getFileBasedPieceType(7)).toBe(Knight);
  expect(getFileBasedPieceType(8)).toBe(Rook);
});

test('getFileBasedPieceSubType', () => {
  const { West, East } = PieceSubType;

  expect(getFileBasedPieceSubType(1)).toBe(West);
  expect(getFileBasedPieceSubType(2)).toBe(West);
  expect(getFileBasedPieceSubType(3)).toBe(West);
  expect(getFileBasedPieceSubType(4)).toBeUndefined();
  expect(getFileBasedPieceSubType(5)).toBeUndefined();
  expect(getFileBasedPieceSubType(6)).toBe(East);
  expect(getFileBasedPieceSubType(7)).toBe(East);
  expect(getFileBasedPieceSubType(8)).toBe(East);
});

test('initializeBoard', () => {
  expect(initializeBoard()).toMatchSnapshot();
});

test('emptyBoard', () => {
  const board = initializeBoard();
  expect(emptyBoard(board)).toMatchSnapshot();
});

test('getCell', () => {
  const board = initializeBoard();

  const expectedPiece: Piece = {
    color: Color.White,
    hasNeverMoved: true,
    isFromPromotion: false,
    subType: PieceSubType.West,
    type: PieceType.Rook,
  };

  const expectedCell: Cell = {
    file: 'a',
    rank: 1,
    piece: expectedPiece,
  };

  expect(getCell(board, 'a', 1)).toStrictEqual(expectedCell);
  expect(getCell(board, 'z', 1)).toBeUndefined();
});
