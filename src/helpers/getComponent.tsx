import React from 'react';
import WhitePawn from '../images/pawn_white.svg';
import BlackPawn from '../images/pawn_black.svg';
import WhiteRock from '../images/rook_white.svg';
import BlackRock from '../images/rook_black.svg';
import WhiteKnight from '../images/knight_white.svg';
import BlackKnight from '../images/knight_black.svg';
import WhiteBishop from '../images/bishop_white.svg';
import BlackBishop from '../images/bishop_black.svg';
import WhiteKing from '../images/king_white.svg';
import BlackKing from '../images/king_black.svg';
import WhiteQueen from '../images/queen_white.svg';
import BlackQueen from '../images/queen_black.svg';
import { Piece } from '../common/pieces';

export const getComponent = (piece: Piece) => {
    if (piece === undefined) return null;

    let char = piece.color === 'white' ? piece.symbol.toUpperCase() : piece.symbol.toLowerCase();
    switch (char) {
        case 'P':
            return <WhitePawn/>;
        case 'R':
            return <WhiteRock/>;
        case 'N':
            return <WhiteKnight/>;
        case 'B':
            return <WhiteBishop/>;
        case 'Q':
            return <WhiteQueen/>;
        case 'K':
            return <WhiteKing/>;
        case 'p':
            return <BlackPawn/>;
        case 'r':
            return <BlackRock/>;
        case 'n':
            return <BlackKnight/>;
        case 'b':
            return <BlackBishop/>;
        case 'q':
            return <BlackQueen/>;
        case 'k':
            return <BlackKing/>;
        default:
            return null;
    }
}
