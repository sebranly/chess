import {
  getPosition,
  getFileNumber,
  getSquare,
  getFileBasedPieceType,
  getFileBasedPieceSubType,
  getFileLetter,
  getPiecePoints,
  emptyBoard,
  initializeBoard,
  initializePiece,
  setSquare,
  getSquareColor,
} from '../index';
import { cloneDeep, differenceWith, isEqual } from 'lodash';
import { Square, Color, Piece, PieceSubType, PieceType } from '../types';

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
  expect(initializeBoard(true)).toMatchSnapshot('empty');
});

test('emptyBoard', () => {
  const board = initializeBoard();
  expect(emptyBoard(board)).toMatchSnapshot();
});

test('getSquare', () => {
  const board = initializeBoard();

  const expectedPiece: Piece = {
    color: Color.White,
    hasNeverMoved: true,
    isFromPromotion: false,
    subType: PieceSubType.West,
    type: PieceType.Rook,
  };

  const expectedSquare: Square = {
    file: 'a',
    rank: 1,
    piece: expectedPiece,
  };

  expect(getSquare(board, 'a1')).toStrictEqual(expectedSquare);
  expect(getSquare(board, 'z1')).toBeUndefined();
});

test('setSquare', () => {
  const board = initializeBoard();
  const piece = initializePiece(Color.Black);
  const originalBoard = cloneDeep(board);
  const originalPiece = cloneDeep(piece);

  setSquare(board, 'a2', piece);

  expect(board.fileCount).toBe(originalBoard.fileCount);
  expect(board.rankCount).toBe(originalBoard.rankCount);

  const differences = differenceWith(board.squares, originalBoard.squares, isEqual);

  expect(differences).toStrictEqual([
    {
      file: 'a',
      rank: 2,
      piece: originalPiece,
    },
  ]);
});

test('getPosition', () => {
  const noPosition = getPosition('b1a');
  expect(noPosition).toBeUndefined();

  const position1 = getPosition('b1');
  expect(position1).toStrictEqual({
    file: 'b',
    rank: 1,
  });

  const position2 = getPosition('B1');
  expect(position2).toStrictEqual({
    file: 'b',
    rank: 1,
  });
});

test('getFileNumber', () => {
  expect(getFileNumber('a')).toBe(1);
  expect(getFileNumber('h')).toBe(8);
});

test('getSquareColor', () => {
  expect(getSquareColor('a1')).toBe(Color.Black);
  expect(getSquareColor('a2')).toBe(Color.White);
  expect(getSquareColor('a8')).toBe(Color.White);
  expect(getSquareColor('e4')).toBe(Color.White);
  expect(getSquareColor('h1')).toBe(Color.White);
  expect(getSquareColor('h8')).toBe(Color.Black);
});
