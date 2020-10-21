import React from 'react';
import { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
    component: any;
    position: { x: number; y: number };
    piece: string;
    callback: (x: number, y: number, piece: string) => void;
}

export const Square: FunctionComponent<Props> = (props: Props) => {
    return (
        <TouchableOpacity style={styles.square} onPress={() => props.callback(props.position.x, props.position.y, props.piece)}>
            {props.component != null && props.component}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    square: {
        height: 50,
        width: '12.5%',
        borderColor: 'black',
        borderWidth: 1,
        overflow: 'hidden',
    },
});
