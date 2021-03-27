import {
  getMoves,
  getMovesQueen,
  getMovesBishop,
  getMovesKing,
  getMovesKnight,
  getMovesPawn,
  getMovesRook,
  isInCheck,
} from '../moves';
import { emptyBoard, emptySquare, initializeBoard, initializePiece, setSquare } from '../index';
import { Color, PieceSubType, PieceType } from '../types';

const board = initializeBoard(true);

// TODO: code resetBoard
const boardBis = initializeBoard();

const pieceWhiteBishop = initializePiece(Color.White, PieceType.Bishop, PieceSubType.West);
const pieceWhiteKing = initializePiece(Color.White, PieceType.King);
const pieceWhiteKnight = initializePiece(Color.White, PieceType.Knight, PieceSubType.West);
const pieceWhitePawn = initializePiece(Color.White);
const pieceWhiteQueen = initializePiece(Color.White, PieceType.Queen);
const pieceWhiteRook = initializePiece(Color.White, PieceType.Rook, PieceSubType.West);

const pieceBlackBishop = initializePiece(Color.Black, PieceType.Bishop, PieceSubType.West);
const pieceBlackKing = initializePiece(Color.Black, PieceType.King);
const pieceBlackKnight = initializePiece(Color.Black, PieceType.Knight, PieceSubType.West);
const pieceBlackPawn = initializePiece(Color.Black);
const pieceBlackQueen = initializePiece(Color.Black, PieceType.Queen);

const movesBishop1 = [
  { file: 'c', rank: 5 },
  { file: 'b', rank: 6 },
  { file: 'a', rank: 7 },
  { file: 'e', rank: 5 },
  { file: 'f', rank: 6 },
  { file: 'g', rank: 7 },
  { file: 'h', rank: 8 },
  { file: 'e', rank: 3 },
  { file: 'f', rank: 2 },
  { file: 'g', rank: 1 },
  { file: 'c', rank: 3 },
  { file: 'b', rank: 2 },
  { file: 'a', rank: 1 },
];

const movesRook = [
  { file: 'd', rank: 5 },
  { file: 'd', rank: 6 },
  { file: 'd', rank: 7 },
  { file: 'd', rank: 8 },
  { file: 'e', rank: 4 },
  { file: 'f', rank: 4 },
  { file: 'g', rank: 4 },
  { file: 'h', rank: 4 },
  { file: 'd', rank: 3 },
  { file: 'd', rank: 2 },
  { file: 'd', rank: 1 },
  { file: 'c', rank: 4 },
  { file: 'b', rank: 4 },
  { file: 'a', rank: 4 },
];

test('getMovesKing', () => {
  setSquare(board, 'e4', pieceWhiteKing);

  const movesKing1 = [
    { file: 'd', rank: 3 },
    { file: 'e', rank: 3 },
    { file: 'f', rank: 3 },
    { file: 'd', rank: 4 },
    { file: 'f', rank: 4 },
    { file: 'd', rank: 5 },
    { file: 'e', rank: 5 },
    { file: 'f', rank: 5 },
  ];

  expect(getMoves(board, 'e4')).toStrictEqual(movesKing1);
  expect(getMovesKing(board, 'e4', Color.White)).toStrictEqual(movesKing1);

  emptySquare(board, 'e4');
  setSquare(board, 'h8', pieceWhiteKing);

  const movesKing2 = [
    { file: 'g', rank: 7 },
    { file: 'h', rank: 7 },
    { file: 'g', rank: 8 },
  ];

  expect(getMoves(board, 'h8')).toStrictEqual(movesKing2);
  expect(getMovesKing(board, 'h8', Color.White)).toStrictEqual(movesKing2);

  setSquare(board, 'g7', pieceBlackQueen);
  setSquare(board, 'g8', pieceBlackKing);
  setSquare(board, 'h7', pieceWhitePawn);

  const movesKing3 = [{ file: 'g', rank: 7 }];

  expect(getMoves(board, 'h8')).toStrictEqual(movesKing3);
  expect(getMovesKing(board, 'h8', Color.White)).toStrictEqual(movesKing3);
});

test('getMovesBishop', () => {
  emptyBoard(board);
  setSquare(board, 'd4', pieceWhiteBishop);

  expect(getMoves(board, 'd4')).toStrictEqual(movesBishop1);
  expect(getMovesBishop(board, 'd4', Color.White)).toStrictEqual(movesBishop1);

  setSquare(board, 'e5', pieceWhitePawn);
  setSquare(board, 'e3', pieceBlackQueen);
  setSquare(board, 'b2', pieceBlackKing);

  const movesBishop2 = [
    { file: 'c', rank: 5 },
    { file: 'b', rank: 6 },
    { file: 'a', rank: 7 },
    { file: 'e', rank: 3 },
    { file: 'c', rank: 3 },
  ];

  expect(getMoves(board, 'd4')).toStrictEqual(movesBishop2);
  expect(getMovesBishop(board, 'd4', Color.White)).toStrictEqual(movesBishop2);
});

test('getMovesRook', () => {
  emptyBoard(board);
  setSquare(board, 'd4', pieceWhiteRook);

  expect(getMoves(board, 'd4')).toStrictEqual(movesRook);
  expect(getMovesRook(board, 'd4', Color.White)).toStrictEqual(movesRook);
});

test('getMovesQueen', () => {
  emptyBoard(board);
  setSquare(board, 'd4', pieceWhiteQueen);

  const movesQueen = [...movesBishop1, ...movesRook];

  expect(getMoves(board, 'd4')).toStrictEqual(movesQueen);
  expect(getMovesQueen(board, 'd4', Color.White)).toStrictEqual(movesQueen);
});

test('getMovesKnight', () => {
  emptyBoard(board);
  setSquare(board, 'd4', pieceWhiteKnight);

  const movesKnight = [
    { file: 'b', rank: 5 },
    { file: 'c', rank: 6 },
    { file: 'e', rank: 6 },
    { file: 'f', rank: 5 },
    { file: 'b', rank: 3 },
    { file: 'c', rank: 2 },
    { file: 'e', rank: 2 },
    { file: 'f', rank: 3 },
  ];

  expect(getMoves(board, 'd4')).toStrictEqual(movesKnight);
  expect(getMovesKnight(board, 'd4', Color.White)).toStrictEqual(movesKnight);

  setSquare(board, 'b5', pieceBlackQueen);
  setSquare(board, 'c6', pieceBlackKing);
  setSquare(board, 'e6', pieceWhiteBishop);
  setSquare(board, 'f5', pieceWhiteKing);

  const movesKnight1 = [
    { file: 'b', rank: 5 },
    { file: 'b', rank: 3 },
    { file: 'c', rank: 2 },
    { file: 'e', rank: 2 },
    { file: 'f', rank: 3 },
  ];

  expect(getMoves(board, 'd4')).toStrictEqual(movesKnight1);
  expect(getMovesKnight(board, 'd4', Color.White)).toStrictEqual(movesKnight1);

  emptyBoard(board);
  setSquare(board, 'b1', pieceWhiteKnight);
  setSquare(board, 'd2', pieceWhiteRook);
  setSquare(board, 'b2', pieceWhiteBishop);

  const movesKnight2 = [
    { file: 'a', rank: 3 },
    { file: 'c', rank: 3 },
  ];

  expect(getMoves(board, 'b1')).toStrictEqual(movesKnight2);
  expect(getMovesKnight(board, 'b1', Color.White)).toStrictEqual(movesKnight2);
});

test('getMovesPawn', () => {
  // Initial rank
  emptyBoard(board);
  setSquare(board, 'd2', pieceWhitePawn);

  const movesPawn1 = [
    { file: 'd', rank: 3 },
    { file: 'd', rank: 4 },
  ];

  expect(getMoves(board, 'd2')).toStrictEqual(movesPawn1);
  expect(getMovesPawn(board, 'd2', Color.White)).toStrictEqual(movesPawn1);

  setSquare(board, 'c3', pieceBlackBishop);
  setSquare(board, 'e3', pieceBlackKnight);

  const movesPawn2 = [
    { file: 'd', rank: 3 },
    { file: 'c', rank: 3 },
    { file: 'e', rank: 3 },
    { file: 'd', rank: 4 },
  ];

  expect(getMoves(board, 'd2')).toStrictEqual(movesPawn2);
  expect(getMovesPawn(board, 'd2', Color.White)).toStrictEqual(movesPawn2);

  setSquare(board, 'd4', pieceBlackQueen);

  const movesPawn3 = [
    { file: 'd', rank: 3 },
    { file: 'c', rank: 3 },
    { file: 'e', rank: 3 },
  ];

  expect(getMoves(board, 'd2')).toStrictEqual(movesPawn3);
  expect(getMovesPawn(board, 'd2', Color.White)).toStrictEqual(movesPawn3);

  setSquare(board, 'd4', pieceWhiteBishop);

  expect(getMoves(board, 'd2')).toStrictEqual(movesPawn3);
  expect(getMovesPawn(board, 'd2', Color.White)).toStrictEqual(movesPawn3);

  setSquare(board, 'd3', pieceBlackPawn);

  const movesPawn4 = [
    { file: 'c', rank: 3 },
    { file: 'e', rank: 3 },
  ];

  expect(getMoves(board, 'd2')).toStrictEqual(movesPawn4);
  expect(getMovesPawn(board, 'd2', Color.White)).toStrictEqual(movesPawn4);

  emptySquare(board, 'd4');

  expect(getMoves(board, 'd2')).toStrictEqual(movesPawn4);
  expect(getMovesPawn(board, 'd2', Color.White)).toStrictEqual(movesPawn4);

  setSquare(board, 'c3', pieceWhiteBishop);

  const movesPawn5 = [{ file: 'e', rank: 3 }];

  expect(getMoves(board, 'd2')).toStrictEqual(movesPawn5);
  expect(getMovesPawn(board, 'd2', Color.White)).toStrictEqual(movesPawn5);

  setSquare(board, 'e3', pieceWhiteKnight);

  expect(getMoves(board, 'd2')).toStrictEqual([]);
  expect(getMovesPawn(board, 'd2', Color.White)).toStrictEqual([]);

  // Non-initial rank
  emptyBoard(board);
  setSquare(board, 'd3', pieceWhitePawn);

  const movesPawn6 = [{ file: 'd', rank: 4 }];

  expect(getMoves(board, 'd3')).toStrictEqual(movesPawn6);
  expect(getMovesPawn(board, 'd3', Color.White)).toStrictEqual(movesPawn6);

  setSquare(board, 'c4', pieceBlackBishop);
  setSquare(board, 'e4', pieceBlackKnight);

  const movesPawn7 = [
    { file: 'd', rank: 4 },
    { file: 'c', rank: 4 },
    { file: 'e', rank: 4 },
  ];

  expect(getMoves(board, 'd3')).toStrictEqual(movesPawn7);
  expect(getMovesPawn(board, 'd3', Color.White)).toStrictEqual(movesPawn7);

  setSquare(board, 'd5', pieceBlackQueen);

  expect(getMoves(board, 'd3')).toStrictEqual(movesPawn7);
  expect(getMovesPawn(board, 'd3', Color.White)).toStrictEqual(movesPawn7);

  setSquare(board, 'd5', pieceWhiteBishop);

  expect(getMoves(board, 'd3')).toStrictEqual(movesPawn7);
  expect(getMovesPawn(board, 'd3', Color.White)).toStrictEqual(movesPawn7);

  setSquare(board, 'd4', pieceBlackPawn);

  const movesPawn8 = [
    { file: 'c', rank: 4 },
    { file: 'e', rank: 4 },
  ];

  expect(getMoves(board, 'd3')).toStrictEqual(movesPawn8);
  expect(getMovesPawn(board, 'd3', Color.White)).toStrictEqual(movesPawn8);

  emptySquare(board, 'd5');

  expect(getMoves(board, 'd3')).toStrictEqual(movesPawn8);
  expect(getMovesPawn(board, 'd3', Color.White)).toStrictEqual(movesPawn8);

  setSquare(board, 'c4', pieceWhiteBishop);

  const movesPawn9 = [{ file: 'e', rank: 4 }];

  expect(getMoves(board, 'd3')).toStrictEqual(movesPawn9);
  expect(getMovesPawn(board, 'd3', Color.White)).toStrictEqual(movesPawn9);

  setSquare(board, 'e4', pieceWhiteKnight);

  expect(getMoves(board, 'd3')).toStrictEqual([]);
  expect(getMovesPawn(board, 'd3', Color.White)).toStrictEqual([]);
});

test('isInCheck', () => {
  expect(isInCheck(boardBis, Color.Black)).toBe(false);
  expect(isInCheck(boardBis, Color.White)).toBe(false);

  emptySquare(boardBis, 'e2');
  emptySquare(boardBis, 'e7');

  expect(isInCheck(boardBis, Color.Black)).toBe(false);
  expect(isInCheck(boardBis, Color.White)).toBe(false);

  emptySquare(boardBis, 'd1');
  setSquare(boardBis, 'e2', pieceWhiteQueen);

  expect(isInCheck(boardBis, Color.Black)).toBe(true);
  expect(isInCheck(boardBis, Color.White)).toBe(false);

  emptyBoard(board);

  setSquare(board, 'e1', pieceWhiteKing);
  setSquare(board, 'e3', pieceBlackKing);

  expect(isInCheck(board, Color.Black)).toBe(false);
  expect(isInCheck(board, Color.White)).toBe(false);

  setSquare(board, 'd2', pieceWhiteBishop);

  expect(isInCheck(board, Color.Black)).toBe(true);
  expect(isInCheck(board, Color.White)).toBe(false);

  setSquare(board, 'c3', pieceBlackBishop);

  expect(isInCheck(board, Color.Black)).toBe(true);
  expect(isInCheck(board, Color.White)).toBe(false);

  setSquare(board, 'd2', pieceWhiteQueen);

  expect(isInCheck(board, Color.Black)).toBe(true);
  expect(isInCheck(board, Color.White)).toBe(false);

  setSquare(board, 'd2', pieceWhitePawn);

  expect(isInCheck(board, Color.Black)).toBe(true);
  expect(isInCheck(board, Color.White)).toBe(false);

  emptySquare(board, 'd2');

  expect(isInCheck(board, Color.Black)).toBe(false);
  expect(isInCheck(board, Color.White)).toBe(true);

  emptySquare(board, 'c3');

  expect(isInCheck(board, Color.Black)).toBe(false);
  expect(isInCheck(board, Color.White)).toBe(false);

  setSquare(board, 'c2', pieceWhiteKnight);

  expect(isInCheck(board, Color.Black)).toBe(true);
  expect(isInCheck(board, Color.White)).toBe(false);

  emptySquare(board, 'c2');

  setSquare(board, 'd3', pieceWhiteRook);

  expect(isInCheck(board, Color.Black)).toBe(true);
  expect(isInCheck(board, Color.White)).toBe(false);

  // TODO: add unit tests for several pieces doing check
  // TODO: add unit tests for blocked check
});
