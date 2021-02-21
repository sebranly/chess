export enum PieceType {
  Bishop = 'bishop',
  King = 'king',
  Knight = 'knight',
  Pawn = 'pawn',
  Queen = 'queen',
  Rook = 'rook',
}

/**
 * Left and Right does not sound right
 * because it's relative to the team
 * Whereas West and East are global and not misleading
 */
export enum PieceSubType {
  West = 'west',
  East = 'east',
}

export enum Color {
  Black = 'black',
  White = 'white',
}

export interface Piece {
  color: Color;
  hasNeverMoved: boolean;
  isFromPromotion: boolean;
  possibleMoves: Position[];
  type: PieceType;
  subType?: PieceSubType;
}

export interface Position {
  file: string;
  rank: number;
}

export interface Square extends Position {
  piece?: Piece;
}

export interface Board {
  squares: Square[];
  fileCount: number;
  rankCount: number;
}
