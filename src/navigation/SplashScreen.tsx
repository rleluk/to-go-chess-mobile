import React from 'react';
import {StyleSheet, View, Text, ImageBackground} from "react-native";


const SplashScreen = ({navigation}: any) => {
    return (
        <ImageBackground resizeMode='stretch' source={require('../images/background.png')} style={styles.container}>
            <Text style={{color: 'white', fontSize: 25}}>Ładowanie...</Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SplashScreen;
