import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Switch, ImageBackground} from "react-native";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {toggleAutomaticRotation} from "../actions";

const SettingsScreen = ({toggleAutomaticRotation, rotateAutomatically}: any) => {
    return (
        <ImageBackground source={require('../images/togochessbackground.jpg')} style={{width: '100%', height: '100%'}}>
            <View style={{display: 'flex'}}>
                <View style={styles.setting}>
                    <Text style={{fontSize: 16, color: '#707070', marginTop: 1}}>
                        Automatyczna rotacja szachownicy
                    </Text>
                    <Switch 
                        trackColor={{ false: "#767577", true: "#158dab" }}
                        thumbColor={rotateAutomatically ? "#085f75" : '#f4f3f4'}
                        onValueChange={toggleAutomaticRotation}
                        value={rotateAutomatically}
                        accessibilityLabel="halo"
                        accessibilityHint="halo"
                        style={{marginLeft: 20}}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    setting: {
        marginTop: 20, 
        paddingHorizontal: 20, 
        paddingVertical: 10,
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: "#ecead1"
    },
});

const mapStateToProps = (state: any) => {
    const {rotateAutomatically} = state.app;
    return {
        rotateAutomatically
    };
};

const mapDispatchToProps = (dispatch: any) => ({
...bindActionCreators(
    {
        toggleAutomaticRotation
    },
    dispatch,
),
});
  
const WrappedSettingsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsScreen);
  
export default WrappedSettingsScreen;
