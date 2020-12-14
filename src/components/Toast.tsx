import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {closeToast} from "../actions";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";

let timeOut;
let interval;

const Toast = (props) => {
    if (!props.toast || !props.toast.content) {
        return <></>
    }
    const [opacity, setOpacity] = useState(1);
    useEffect(() => {
        if (timeOut) {
            clearTimeout(timeOut);
        }
        if (interval) {
            clearInterval(interval);
        }
        const options = props.toast.options;
        if (options) {
            if (options.fade) {
                setOpacity(1);
                timeOut = setTimeout(() => {
                    const ms = 16;
                    const fadeTime = 500;
                    let value = 1;
                    interval = setInterval(() => {
                        if (value - ms / fadeTime < 0) {
                            clearInterval(interval);
                            props.closeToast();
                        } else {
                            value = value - ms / fadeTime;
                            setOpacity(value);
                        }
                    }, ms);
                }, 2500);
            }
        }
    }, [props.toast]);
    return (
        <View style={{...styles.toast, opacity}}>
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
