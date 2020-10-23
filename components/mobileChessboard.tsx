import React from 'react';
import { useEffect, useState, FunctionComponent } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Chessboard } from '../common/core/chessboard';
import { BoardInfo } from '../common/core/board-info';
import { Piece } from '../common/pieces';
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

interface Props {
    chessboard: Chessboard;
    onMove: (move: string) => void;
}

const getComponent = (piece: Piece) => {
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

const generateGridItems = (boardInfo: BoardInfo, onPress: Function) => {
    let items: any[] = [];

    for(let row = 8; row >= 1; row--) {
        for(let column = 1; column <= 8; column++) {
            let piece = boardInfo.get(row, column);
            let svg = getComponent(piece);
            let symbol = piece === undefined ? 'blank' : piece.getSymbol();
            items.push(
                <TouchableOpacity key={symbol + row + column} style={styles.square} onPress={() => onPress(piece, row, column)}>
                    {svg}
                </TouchableOpacity>
            );
        }
    }

    return items;
};

export const MobileChessboard: FunctionComponent<Props> = (props: Props) => {
    const [positionFEN, setPositionFEN] = useState(props.chessboard.positionFEN);
    const [boardInfo, setBoardInfo] = useState(new BoardInfo().fromFEN(positionFEN));
    const [firstPress, setFirstPress] = useState<Piece>();

    useEffect(() => {
        props.chessboard.callback = (newPosition) => {
            setPositionFEN(newPosition);
            setBoardInfo(new BoardInfo().fromFEN(newPosition));
        };
    });
    
    const onPress = (piece: Piece, row: number, column: number) => {
        if (piece !== undefined && firstPress === undefined) {
            setFirstPress(piece);
        } else if (firstPress !== undefined) {
            const moves = firstPress.possibleMoves(boardInfo);
            for (let move of moves) {
                if (move.row === row && move.column === column) {
                    let movePGN: string = '';
                    if (firstPress.symbol === 'p') {
                        if ( move.type === 'capture') movePGN += 'abcdefgh'[firstPress.column - 1] + 'x';
                    } else {
                        movePGN += firstPress.symbol.toUpperCase();
                        if (move.type === 'capture') movePGN += 'x';
                    }
                    movePGN += 'abcdefgh'[column - 1] + row;
                    props.onMove(movePGN)
                    break;
                }
            }
            setFirstPress(undefined);
        } else {
            setFirstPress(undefined);
        }
    };

    const items = generateGridItems(boardInfo, onPress);

    return (
        <View style={styles.chessboard}>
            {items}
        </View>
    );
};

const styles = StyleSheet.create({
    chessboard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
    },
    square: {
        height: 50,
        width: '12.5%',
        borderColor: 'black',
        borderWidth: 1,
        overflow: 'hidden',
    },
});
