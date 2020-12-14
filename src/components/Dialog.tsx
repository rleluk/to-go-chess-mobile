import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {closeDialog} from "../actions";
import {Modal, StyleSheet, View, Text, TouchableOpacity} from "react-native";

const Dialog = (props: any) => {
    if (!props.dialog || !props.dialog.content) {
        return <></>
    }
    return (
        <Modal
            transparent={true}
            animationType="fade"
        >
            <View style={styles.outerView}>
                <View style={styles.modal}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => {
                        props.closeDialog();
                    }}>
                        <Text style={styles.closeButtonText}>x</Text>
                    </TouchableOpacity>
                    {props.dialog.content}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    outerView: {
        backgroundColor: "#000000aa",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'rgb(215,210,146)',
        borderRadius: 10,
        paddingTop: 18,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        right: 6,
        top: -2,
    },
    closeButtonText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#ac0606"
    }
});

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
            closeDialog,
        },
        dispatch,
    ),
});

const mapStateToProps = (state: any) => {
    const {dialog} = state.app;
    return {
        dialog,
    };
};

const DialogComponent = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Dialog);

export default DialogComponent;
