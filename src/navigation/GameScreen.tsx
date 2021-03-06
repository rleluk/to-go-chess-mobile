import React, {useEffect} from 'react';
import GameComponent from "../components/GameComponent";
import {StyleSheet, View} from "react-native";
import UserBar from "../components/UserBar";


const GameScreen = ({route, navigation}: any) => {

    useEffect(() => {
        console.log("route.params =", route.params);
    }, [route]);

    return (
        <>
            {/* <UserBar navigation={navigation} /> */}
            <View style={styles.container}>
                <GameComponent route={route} navigation={navigation}/>
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

export default GameScreen;
