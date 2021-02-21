import {
  getPossibleMoves,
  getPossibleMovesQueen,
  getPossibleMovesBishop,
  getPossibleMovesKing,
  getPossibleMovesRook,
} from '../moves';
import { emptyBoard, emptySquare, initializeBoard, initializePiece, setSquare } from '../index';
import { Color, PieceSubType, PieceType } from '../types';

test('getPossibleMoves etc.', () => {
  // King
  const board = initializeBoard(true);
  const pieceWhiteKing = initializePiece(Color.White, PieceType.King);
  setSquare(board, 'e4', pieceWhiteKing);

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
  expect(getPossibleMovesKing(board, 'e4', Color.White)).toStrictEqual(expectedMovesKing1);

  emptySquare(board, 'e4');
  setSquare(board, 'h8', pieceWhiteKing);

  const expectedMovesKing2 = [
    { file: 'g', rank: 7 },
    { file: 'h', rank: 7 },
    { file: 'g', rank: 8 },
  ];

  expect(getPossibleMoves(board, 'h8')).toStrictEqual(expectedMovesKing2);
  expect(getPossibleMovesKing(board, 'h8', Color.White)).toStrictEqual(expectedMovesKing2);

  const pieceBlackQueen = initializePiece(Color.Black, PieceType.Queen);
  const pieceBlackKing = initializePiece(Color.Black, PieceType.King);
  const pieceWhitePawn = initializePiece(Color.White);

  setSquare(board, 'g7', pieceBlackQueen);
  setSquare(board, 'g8', pieceBlackKing);
  setSquare(board, 'h7', pieceWhitePawn);

  const expectedMovesKing3 = [{ file: 'g', rank: 7 }];

  expect(getPossibleMoves(board, 'h8')).toStrictEqual(expectedMovesKing3);
  expect(getPossibleMovesKing(board, 'h8', Color.White)).toStrictEqual(expectedMovesKing3);

  // Bishop
  emptyBoard(board);
  const pieceWhiteBishop = initializePiece(Color.White, PieceType.Bishop, PieceSubType.West);
  setSquare(board, 'd4', pieceWhiteBishop);

  const expectedMovesBishop1 = [
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

  expect(getPossibleMoves(board, 'd4')).toStrictEqual(expectedMovesBishop1);
  expect(getPossibleMovesBishop(board, 'd4', Color.White)).toStrictEqual(expectedMovesBishop1);

  setSquare(board, 'e5', pieceWhitePawn);
  setSquare(board, 'e3', pieceBlackQueen);
  setSquare(board, 'b2', pieceBlackKing);

  const expectedMovesBishop2 = [
    { file: 'c', rank: 5 },
    { file: 'b', rank: 6 },
    { file: 'a', rank: 7 },
    { file: 'e', rank: 3 },
    { file: 'c', rank: 3 },
  ];

  expect(getPossibleMoves(board, 'd4')).toStrictEqual(expectedMovesBishop2);
  expect(getPossibleMovesBishop(board, 'd4', Color.White)).toStrictEqual(expectedMovesBishop2);

  // Rook
  emptyBoard(board);
  const pieceWhiteRook = initializePiece(Color.White, PieceType.Rook, PieceSubType.West);
  setSquare(board, 'd4', pieceWhiteRook);

  const expectedMovesRook = [
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

  expect(getPossibleMoves(board, 'd4')).toStrictEqual(expectedMovesRook);
  expect(getPossibleMovesRook(board, 'd4', Color.White)).toStrictEqual(expectedMovesRook);

  // Queen
  emptyBoard(board);
  const pieceWhiteQueen = initializePiece(Color.White, PieceType.Queen);
  setSquare(board, 'd4', pieceWhiteQueen);

  const expectedMovesQueen = [...expectedMovesBishop1, ...expectedMovesRook];

  expect(getPossibleMoves(board, 'd4')).toStrictEqual(expectedMovesQueen);
  expect(getPossibleMovesQueen(board, 'd4', Color.White)).toStrictEqual(expectedMovesQueen);
});
