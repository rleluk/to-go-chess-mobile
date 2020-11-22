import React from 'react';

import {StyleSheet, Text, TouchableOpacity} from "react-native";

export const ChessButton = (props: any) => {
    return (
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "rgb(55,55,55)",
        borderWidth: 2,
        borderColor: "#292929",
        padding: 5,
        borderRadius: 6,
        margin: 4,
    },
    text: {
        color: "#e2e2e2",
        textAlign: 'center'
    }
});

