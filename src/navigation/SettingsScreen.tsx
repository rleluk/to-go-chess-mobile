import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Switch, ImageBackground} from "react-native";
import {Picker} from '@react-native-picker/picker';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {toggleAutomaticRotation, changeBotLevel} from "../actions";

const SettingsScreen = ({toggleAutomaticRotation, rotateAutomatically, botLevel, changeBotLevel}: any) => {
    return (
        <ImageBackground source={require('../images/togochessbackground.jpg')} style={{width: '100%', height: '100%'}}>
            <View style={{display: 'flex'}}>
                <View style={{...styles.setting, ...styles.boxShadow}}>
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
                <View style={{...styles.setting, ...styles.boxShadow}}>
                    <Text style={{fontSize: 16, color: '#707070', marginTop: 1}}>
                        Poziom trudności silnika
                    </Text>
                    <View style={{borderWidth: 1, borderColor: '#70707099', borderRadius: 6}}>
                        <Picker
                            selectedValue={botLevel}
                            onValueChange={(itemValue, itemIndex) => changeBotLevel(itemValue)}
                            style={{height: 30, width: 100}}
                        >
                            <Picker.Item label="5" value="5"/>
                            <Picker.Item label="10" value="10"/>
                            <Picker.Item label="15" value="15"/>
                        </Picker>
                    </View>
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
        backgroundColor: "#ecead1"
    },
    boxShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});

const mapStateToProps = (state: any) => {
    const {rotateAutomatically, botLevel} = state.app;
    return {
        rotateAutomatically,
        botLevel
    };
};

const mapDispatchToProps = (dispatch: any) => ({
...bindActionCreators(
    {
        toggleAutomaticRotation,
        changeBotLevel
    },
    dispatch,
),
});
  
const WrappedSettingsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsScreen);
  
export default WrappedSettingsScreen;
