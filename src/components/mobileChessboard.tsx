import React from 'react';
import { useEffect, useState, FunctionComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Chessboard } from '../common/core/chessboard';
import { BoardInfo } from '../common/core/board-info';
import { Piece, Move } from '../common/pieces';
import { getComponent } from '../helpers/getComponent';


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


interface FirstPress {
    piece: Piece;
    possibleMoves: Move[];
}


export const getMinWindowSize = (): number => Math.min(Dimensions.get('window').width, Dimensions.get('window').height);


const generateGridItems = (boardInfo: BoardInfo, onPress: Function, firstPress: FirstPress | undefined, lastMove: LastMove | undefined) => {
    let items: any[] = [];

    for(let row = 8; row >= 1; row--) {
        for(let column = 1; column <= 8; column++) {
            let piece = boardInfo.get(row, column);
            let svg = getComponent(piece);
            let symbol = piece === undefined ? 'blank' : piece.getSymbol();

            let style: any = {};
            let moves = firstPress?.possibleMoves?.filter(el => el.row === row && el.column === column);
            if (firstPress !== undefined && firstPress.piece === piece) {
                style = styles.highlightedPossibleMove;
            } else if (moves !== undefined && moves.length > 0) {
                style = moves[0].type === 'capture' ? styles.highlightedPossibleCapture : styles.highlightedPossibleMove;
            }
            else if (lastMove !== undefined && (lastMove.move.row === row && lastMove.move.column === column || 
                lastMove.previousPosition.row === row && lastMove.previousPosition.column === column)) {
                style = styles.highlightedLastMove;
            } 

            items.push(
                <TouchableOpacity activeOpacity={1} key={symbol + row + column} style={{...styles.square, ...style}} onPress={() => onPress(piece, row, column)}>
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
    const [firstPress, setFirstPress] = useState<FirstPress>();
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
            setFirstPress({
                piece, 
                possibleMoves: piece.possibleMoves(boardInfo)
            });
        } else if (firstPress !== undefined) {
            if (firstPress.piece === piece) {
                setFirstPress(undefined);
            } 
            else {
                for (let move of firstPress.possibleMoves) {
                    if (move.row === row && move.column === column) {
                        let movePGN: string = '';
                        if (firstPress.piece.symbol === 'p') {
                            if (move.type === 'capture') movePGN += 'abcdefgh'[firstPress.piece.column - 1] + 'x';
                        } else {
                            movePGN += firstPress.piece.symbol.toUpperCase();
                            if (move.type === 'capture') movePGN += 'x';
                        }
                        movePGN += 'abcdefgh'[column - 1] + row;
                        props.onMove(movePGN)
                        setFirstPress(undefined);
                        setLastMove({
                            previousPosition: {
                                row: firstPress.piece.row, 
                                column: firstPress.piece.column
                            }, 
                            move
                        });
                        break;
                    }
                }
            }
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
    highlightedLastMove: {
        backgroundColor: 'rgba(161, 148, 10, 0.6)'
    },
    highlightedPossibleMove: {
        backgroundColor: 'rgba(22, 141, 181, 0.5)'
    },
    highlightedPossibleCapture: {
        backgroundColor: 'rgba(204, 54, 24, 0.5)'
    }
});