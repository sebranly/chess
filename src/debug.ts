// npx ts-node src/debug.ts

import { displayBoard } from './display';
import { initializeBoard } from './index';

const board = initializeBoard();
displayBoard(board, true);
