import React from 'react';
import {View, ImageBackground, TouchableOpacity, StyleSheet} from 'react-native';
import {FunctionComponent} from 'react';
import {bindActionCreators} from 'redux';
import {gameTreeUpdated} from '../actions';
import {connect} from 'react-redux';

interface Props {style, navigation, game, gameTreeUpdated, isTreeEnabled}

export const MenuBar: FunctionComponent<Props> = (props: Props) => {
    const onPreviousMovePress = () => {
        let node = props.game.getTree().getParent();
        if (node !== undefined) {
            props.game.getTree().setLeaf(node);
            props.game.update(node.positionFEN);
            props.gameTreeUpdated(props.game.getTree().toSerializable());
        }
    }

    const onNextMovePress = () => {
        let node = props.game.getTree().getChild();
        if (node !== undefined) {
            props.game.getTree().setLeaf(node);
            props.game.update(node.positionFEN);
            props.gameTreeUpdated(props.game.getTree().toSerializable());
        }
    }

    return (
        <ImageBackground resizeMode='contain' source={require('../images/bottom_buttons.png')} style={{...props.style, ...styles.buttonContainer}}>
              <TouchableOpacity style={styles.button} onPress={props.navigation.openDrawer}/>
              <TouchableOpacity style={styles.button} onPress={props.isTreeEnabled ? onPreviousMovePress : undefined}/>
              <TouchableOpacity style={styles.button} onPress={props.isTreeEnabled ? onNextMovePress : undefined}/>
              <TouchableOpacity style={styles.button} onPress={() => console.log("Refresh button pressed.")}/>
              <TouchableOpacity style={styles.button} onPress={() => console.log("Smiley face button pressed.")}/>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row'
    },
    button: {
        width: '20%',
    },
});

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
            gameTreeUpdated
        },
        dispatch,
    ),
});

const mapStateToProps = (state: any) => {
    const {game, isTreeEnabled} = state.app;
    return {
        game,
        isTreeEnabled
    };
};

const WrappedMenuBar = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MenuBar);


export default WrappedMenuBar;