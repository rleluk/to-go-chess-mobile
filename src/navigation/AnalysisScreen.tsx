import React, {useEffect} from 'react';
import GameAnalysis from "../components/GameAnalysis";
import {StyleSheet, View} from "react-native";


const AnalysisScreen = ({route, navigation}: any) => {

    useEffect(() => {
        console.log("route.params =", route.params);
    }, [route]);

    return (
        <>
            <View style={styles.container}>
                <GameAnalysis route={route} navigation={navigation}/>
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

export default AnalysisScreen;
