import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {closeToast} from "../actions";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";

const Toast = (props) => {
    if (!props.toast || !props.toast.content) {
        return <></>
    }
    return (
        <View style={styles.toast}>
            {props.toast.content}
        </View>
    );
}
const styles = StyleSheet.create({
    toast: {
        padding: 3,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(215,210,146)'
    }
});


const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
            closeToast,
        },
        dispatch,
    ),
});

const mapStateToProps = (state: any) => {
    const {toast} = state.app;
    return {
        toast,
    };
};

const ToastComponent = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Toast);

export default ToastComponent;
