// npx ts-node src/debug.ts

import { displayBoard, initializeBoard } from './index';

const board = initializeBoard();
displayBoard(board, true);
