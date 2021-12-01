export enum PieceType {
  Bishop = 'bishop',
  King = 'king',
  Knight = 'knight',
  Pawn = 'pawn',
  Queen = 'queen',
  Rook = 'rook'
}

export enum PieceSubType {
  West = 'west',
  East = 'east'
}

export enum Color {
  Black = 'black',
  White = 'white'
}

export interface Piece {
  color: Color;
  hasNeverMoved: boolean;
  isFromPromotion: boolean;
  possibleMoves: string[];
  type: PieceType;
  subType?: PieceSubType;
}

export interface Position {
  file: string;
  rank: number;
}

export interface Square {
  piece?: Piece;
  pos: string;
}

export interface Board {
  squares: Square[];
  fileCount: number;
  rankCount: number;
}
