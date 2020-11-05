import React from 'react';
import TestGame from "../components/testGame";
import {Button, StyleSheet, View} from "react-native";
import UserBar from "../components/UserBar";


const HomeScreen = ({navigation}: any) => {
    return (
        <>
            <UserBar navigation={navigation} />
            <View style={styles.container}>
                <TestGame/>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;
