import React from 'react';
import { useEffect, useState, FunctionComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Chessboard } from '../common/core/chessboard';
import { BoardInfo } from '../common/core/board-info';
import { Piece } from '../common/pieces/piece';
import { Move } from '../common/pieces/move'
import { getComponent } from '../helpers/get-component';
import { PromotionDialog } from './PromotionDialog';


interface Props {
    chessboard: Chessboard;
    onMove: (move: string) => void;
    style: any;
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
            } else if (lastMove !== undefined && (lastMove.move.row === row && lastMove.move.column === column || 
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalCallback, setModalCallback] = useState(() => (symbol: string) => {});

    useEffect(() => {
        props.chessboard.callback = (newPosition) => {
            setPositionFEN(newPosition);
            setBoardInfo(new BoardInfo().fromFEN(newPosition));
        };
    });
    
    const onPress = (piece: Piece, row: number, column: number) => {
        if (piece === firstPress?.piece) {
            setFirstPress(undefined);
        } else if (piece !== undefined && boardInfo.turn == piece.color) {
            setFirstPress({
                piece, 
                possibleMoves: piece.possibleMoves(boardInfo)
            });
        } else if (firstPress !== undefined) {
            let move = firstPress.possibleMoves.filter(move => move.column === column && move.row === row)[0];
            if (move === undefined) return;
            let movePGN: string = '';
            if (firstPress.piece.symbol === 'p') {
                if (move.type === 'capture') movePGN += 'abcdefgh'[firstPress.piece.column - 1] + 'x';
                movePGN += 'abcdefgh'[column - 1] + row;
                if (row === 8 && boardInfo.turn === 'white' || row === 1 && boardInfo.turn === 'black') {
                    setModalCallback(() => (symbol:string) => {
                        movePGN += `=${symbol}`;
                        props.onMove(movePGN);
                        setFirstPress(undefined);
                        setLastMove({
                            previousPosition: {
                                row: firstPress.piece.row, 
                                column: firstPress.piece.column
                            }, 
                            move
                        });
                        setIsModalVisible(false);
                    });
                    setIsModalVisible(true);
                    return;
                }
            } else if (firstPress.piece.symbol === 'k' && move.type === 'kingsideCastle') {
                movePGN += 'O-O';
            } else if (firstPress.piece.symbol === 'k' && move.type === 'queensideCastle') {
                movePGN += 'O-O-O';
            } else {
                movePGN += firstPress.piece.symbol.toUpperCase();
                let samePieces = boardInfo.find(firstPress.piece.symbol, boardInfo.turn).filter(piece => {
                    return piece.checkMove(boardInfo, row, column, move.type);
                });
                let toAdd = '';
                samePieces = samePieces.filter(piece => !(piece.column === firstPress.piece.column && piece.row == firstPress.piece.row));
                if (samePieces.some(piece => piece.row === firstPress.piece.row)) {
                    toAdd += 'abcdefgh'[firstPress.piece.column - 1];
                } 
                if (samePieces.some(piece => piece.column === firstPress.piece.column)) {
                    toAdd += firstPress.piece.row;
                } 
                if (toAdd.length === 0 && samePieces.length !== 0) {
                    toAdd += 'abcdefgh'[firstPress.piece.column - 1];
                }
                if (move.type === 'capture') toAdd += 'x';
                movePGN += toAdd;
                movePGN += 'abcdefgh'[column - 1] + row;
            } 
            props.onMove(movePGN)
            setFirstPress(undefined);
            setLastMove({
                previousPosition: {
                    row: firstPress.piece.row, 
                    column: firstPress.piece.column
                }, 
                move
            });
        } 
    };

    const items = generateGridItems(boardInfo, onPress, firstPress, lastMove);

    return (
        <View style={props.style}>
            <PromotionDialog color={boardInfo.turn} isVisible={isModalVisible} modalCallback={modalCallback}/>
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
