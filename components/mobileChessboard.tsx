import React from 'react';
import { useEffect, useState, FunctionComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { Chessboard } from '../common/core/chessboard';
import { Square } from './square';
import { Player } from '../common/interfaces/player';
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

const charToPiece = (char: string) => {
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

const generateGridItems = (positionFen: string, onPress: (x: number, y: number, piece: string) => void) => {
    let items: any[] = [];
    const position = positionFen.split(' ')[0];
    const pieces = [...position];

    let x = 0, y = 8;
    pieces.forEach((piece) => {
        let nr = Number(piece);  
        if(!isNaN(nr)) {
            for(let i = 0; i < nr; i++) {
                items.push(<Square key={'blank' + x + y} component={<View/>} piece={'blank'} position={{x, y}} callback={onPress}/>);
                x++;
            }
        } else if(piece === '/') {
            x = 0; 
            y--;
        } else {
            const component = charToPiece(piece);
            if(piece == 'p' || piece == 'P') piece = '';
            items.push(<Square key={piece + x + y} component={component} piece={piece.toUpperCase()} position={{x, y}} callback={onPress}/>);
            x++;
        }
    });
    return items;
};

export const MobileChessboard: FunctionComponent<Props> = (props: Props) => {
    const [position, setPosition] = useState(props.chessboard.positionFEN);
    const [firstPosition, setFirstPosition] = useState({x: -1, y: -1, piece: 'blank'});

    useEffect(() => {
        props.chessboard.callback = () => {
            setPosition(props.chessboard.positionFEN);
        };
    });

    const onPress = (x: number, y: number, piece: string) => {
        if(firstPosition.piece === 'blank') setFirstPosition({x, y, piece});
        else {
            const move = firstPosition.piece + 'abcdefgh'[x] + y;
            props.onMove(move);
            setFirstPosition({x: -1, y: -1, piece: 'blank'});
            // console.log(move);
        }
    };

    const items = generateGridItems(position, onPress);
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
});
