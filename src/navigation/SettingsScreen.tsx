import React, {useEffect} from 'react';
import {StyleSheet, View, StatusBar, Text, Switch} from "react-native";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {toggleAutomaticRotation} from "../actions";

const SettingsScreen = ({toggleAutomaticRotation, rotateAutomatically}: any) => {
    return (
        <>
            <StatusBar hidden />
            <View>
                <Text>
                    Automatyczna rotacja szachownicy
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={rotateAutomatically ? "#3344bb" : "#f4f3f4"}
                    onValueChange={toggleAutomaticRotation}
                    value={rotateAutomatically}
                />
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
