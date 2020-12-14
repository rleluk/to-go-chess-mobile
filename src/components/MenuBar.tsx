import React from 'react';
import {View, ImageBackground, TouchableOpacity, StyleSheet, Image, ScrollView} from 'react-native';
import {FunctionComponent} from 'react';
import {bindActionCreators} from 'redux';
import {closeDialog, gameTreeUpdated, openDialog, sendEmote} from '../actions';
import {connect} from 'react-redux';
import emotes from "../utils/emotes";

interface Props {style, navigation, game, gameTreeUpdated, isTreeEnabled, openDialog, closeDialog, sendEmote}

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
              <TouchableOpacity style={styles.button} onPress={() => props.openDialog(
                  <View style={styles.wrapEmotes}>
                      <ScrollView>
                          <View style={styles.emotes}>
                            {emotes.map(emote =>
                                <TouchableOpacity key={emote.index} onPress={() => {
                                    props.closeDialog();
                                    props.sendEmote(emote.index);
                                }}>
                                    <Image source={emote.res} style={{width: 60, height: 60, resizeMode: "contain", margin: 6}}/>
                                </TouchableOpacity>
                                )}
                          </View>
                      </ScrollView>
                  </View>
              )}/>
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
    emotes: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
    },
    wrapEmotes: {
        maxHeight: 300,
        maxWidth: 250,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
});

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
            gameTreeUpdated,
            openDialog,
            closeDialog,
            sendEmote,
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