import React from 'react';
import { useEffect, useState, FunctionComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { getMinWindowSize } from '../helpers/windowSize';
import { Chessboard } from '../common/core/chessboard';
import { BoardInfo } from '../common/core/board-info';
import { Piece, Move } from '../common/pieces';
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

interface LastMove {
    previousPosition: {
        row: number, 
        column: number
    }, 
    move: Move
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

const generateGridItems = (boardInfo: BoardInfo, onPress: Function, firstPress: Piece | undefined, lastMove: LastMove | undefined) => {
    let items: any[] = [];

    for(let row = 8; row >= 1; row--) {
        for(let column = 1; column <= 8; column++) {
            let piece = boardInfo.get(row, column);
            let svg = getComponent(piece);
            let symbol = piece === undefined ? 'blank' : piece.getSymbol();
            
            const style = firstPress !== undefined && firstPress === piece ? 
                styles.highlightedPiece : (
                    lastMove !== undefined && (lastMove.move.row === row && lastMove.move.column === column || 
                    lastMove.previousPosition.row === row && lastMove.previousPosition.column === column) ? 
                    styles.highlightedSquare : styles.square
                )

            items.push(
                <TouchableOpacity activeOpacity={1} key={symbol + row + column} style={style} onPress={() => onPress(piece, row, column)}>
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
    const [lastMove, setLastMove] = useState<LastMove>();
    const [size, setSize] = useState(getMinWindowSize());

    useEffect(() => {
        Dimensions.addEventListener('change', () => setSize(getMinWindowSize()));
        props.chessboard.callback = (newPosition) => {
            setPositionFEN(newPosition);
            setBoardInfo(new BoardInfo().fromFEN(newPosition));
        };
    });
    
    const onPress = (piece: Piece, row: number, column: number) => {
        if (piece !== undefined && firstPress === undefined && boardInfo.turn == piece.color) {
            setFirstPress(piece);
        } else if (firstPress !== undefined) {
            if (firstPress === piece) {
                setFirstPress(undefined);
            } else {
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
                        setFirstPress(undefined);
                        setLastMove({previousPosition: {row: firstPress.row, column: firstPress.column}, move});
                        break;
                    }
                }
            }
        } else {
            setFirstPress(undefined);
        }
    };

    const items = generateGridItems(boardInfo, onPress, firstPress, lastMove);

    return (
        <View style={{width: size, height: size, overflow: 'hidden'}}>
            <ImageBackground resizeMode='contain' source={require('../images/chessboard.png')} style={{flex: 1}}>
                <View style={styles.chessboard}>
                    {items}
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    chessboard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        flexWrap: 'wrap',
    },
    square: {
        height: '11.7%',
        width: '11.7%',
    },
    highlightedPiece: {
        height: '11.7%',
        width: '11.7%',
        backgroundColor: 'rgba(18, 66, 17, 0.6)'
    },
    highlightedSquare: {
        height: '11.7%',
        width: '11.7%',
        backgroundColor: 'rgba(161, 148, 10, 0.6)'
    }
});
