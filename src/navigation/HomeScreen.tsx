import React from 'react';
import SinglePlayerGame from "../components/SinglePlayerGame";
import {StyleSheet, View, StatusBar} from "react-native";
import UserBar from "../components/UserBar";


const HomeScreen = ({navigation}: any) => {
    return (
        <>
            <StatusBar hidden />
            {/* <UserBar navigation={navigation} /> */}
            <View style={styles.container}>
                <SinglePlayerGame navigation={navigation}/>
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
