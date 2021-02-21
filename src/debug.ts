// npx ts-node src/debug.ts

import { displayBoard, print } from './display';
import { initializeBoard, initializePiece, setSquare } from './index';
import { Color, PieceType } from './types';

const USE_NODE = true;

print('\nInitialization\n', USE_NODE);
const board = initializeBoard();
displayBoard(board, USE_NODE);

print('\nKing\n', USE_NODE);
const boardKing = initializeBoard(true);
const pieceKing = initializePiece(Color.White, PieceType.King);
setSquare(boardKing, 'e4', pieceKing);
displayBoard(boardKing, USE_NODE);
