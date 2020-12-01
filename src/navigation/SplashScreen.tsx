import React from 'react';
import {StyleSheet, View, Text, ImageBackground} from "react-native";

interface Props {
    navigation?: any;
    style?: any;
}

const SplashScreen = (props: Props) => {
    return (
        <ImageBackground resizeMode='stretch' source={require('../images/background.png')} style={{...styles.container, ...props.style}}>
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
