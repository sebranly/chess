import { getSquare, getFileLetter } from './index';
import { Board, Color, Piece, PieceType } from './types';
import { DEFAULT_ASCII_LOWERCASE_A, DEFAULT_NOTATION_EMPTY_SQUARE } from './constants';

export const getTerminalNotation = (piece: Piece) => {
  const { color, type } = piece;

  const notation = getTerminalNotationLetter(type);

  return color === Color.White ? notation.toUpperCase() : notation;
};

export const getTerminalNotationLetter = (pieceType: PieceType) => {
  const { Bishop, King, Knight, Pawn, Queen, Rook } = PieceType;

  switch (pieceType) {
    case Pawn:
      return 'p';

    case Bishop:
      return 'b';

    case Knight:
      return 'n';

    case Rook:
      return 'r';

    case Queen:
      return 'q';

    case King:
      return 'k';

    default:
      return DEFAULT_NOTATION_EMPTY_SQUARE;
  }
};

export const print = (text: string, nodeDisplay: boolean) => {
  nodeDisplay ? process.stdout.write(text) : console.log(text);
};

export const displayRankEdge = (board: Board, nodeDisplay: boolean) => {
  const { rankCount } = board;

  print(' ', nodeDisplay);

  for (let rank = 0; rank <= rankCount + 1; rank++) {
    const isEdge = [0, rankCount + 1].includes(rank);
    const symbol = isEdge ? '+' : '-';
    print(symbol, nodeDisplay);
  }

  print('\n', nodeDisplay);
};

export const displayRankNotation = (board: Board, nodeDisplay: boolean) => {
  const { rankCount } = board;

  print(' ', nodeDisplay);

  for (let rank = 0; rank <= rankCount + 1; rank++) {
    const isEdge = [0, rankCount + 1].includes(rank);
    const symbol = isEdge ? ' ' : String.fromCharCode(rank - 1 + DEFAULT_ASCII_LOWERCASE_A);
    print(symbol, nodeDisplay);
  }

  print('\n', nodeDisplay);
};

export const displayBoard = (board: Board, nodeDisplay = false) => {
  const { fileCount, rankCount } = board;

  print('\n', nodeDisplay);

  displayRankNotation(board, nodeDisplay);
  displayRankEdge(board, nodeDisplay);

  for (let rank = rankCount; rank >= 1; rank--) {
    const leftEdge = `${rank}|`;
    const rightEdge = `|${rank}\n`;

    print(leftEdge, nodeDisplay);

    for (let file = 1; file <= fileCount; file++) {
      const fileLetter = getFileLetter(file);
      const rawPosition = `${fileLetter}${rank}`;
      const square = getSquare(board, rawPosition);

      if (square) {
        const { piece } = square;

        if (piece) {
          const notation = getTerminalNotation(piece);

          print(notation, nodeDisplay);
        } else {
          print(DEFAULT_NOTATION_EMPTY_SQUARE, nodeDisplay);
        }
      }
    }

    print(rightEdge, nodeDisplay);
  }

  displayRankEdge(board, nodeDisplay);
  displayRankNotation(board, nodeDisplay);
};
