import React, { useEffect } from 'react';
import {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FunctionComponent} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

interface Props {style, game}

export const GameInfo: FunctionComponent<Props> = (props: Props) => {
    const [time, setTime] = useState<any>();

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(props.game.getTimes());
        }, 250);
        return () => clearInterval(interval);
    });

    return (
        <View style={[props.style, styles.playerInfo]}>
            <View style={styles.timersContainer}>
                <Text style={styles.timer}> 
                    { time ?
                        <>
                            {time.timeWhite.minutes}:
                            {time.timeWhite.seconds < 10 ? <>0</> : null}
                            {time.timeWhite.seconds}
                        </>
                        :
                        <>0:00</>
                    } 
                </Text>
                <Text style={styles.timer}> 
                    { time ?
                        <>
                            {time.timeBlack.minutes}:
                            {time.timeBlack.seconds < 10 ? <>0</> : null}
                            {time.timeBlack.seconds}
                        </>
                        :
                        <>0:00</>
                    } 
                </Text>
            </View>
            <View style={styles.playerContainer}>
                <View style={styles.whiteBox}/>
                <Text style={styles.player}>Player 1</Text>
                <Text style={styles.player}>Player 2</Text>
                <View style={styles.blackBox}/>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    playerInfo: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#fff3ccbb',
        padding: 5
    },
    timersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
    },
    timer: {
        color: '#707070',
        fontWeight: 'bold',
        fontSize: 18
    },
    text: {
        color: '#707070',
        fontFamily: 'SegoeUI-Bold',
    },
    playerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    player: {
        color: '#707070',
        fontFamily: 'SegoeUI-Bold',
        fontSize: 15,
    },
    blackBox: {
        borderColor: '#96031caa',
        borderWidth: 2,
        height: 25,
        width: 24,
        backgroundColor: '#434343'
    },
    whiteBox: {
        borderColor: '#96031caa',
        borderWidth: 2,
        height: 25,
        width: 25,
        backgroundColor: '#d9d9d9'
    }
});

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
        },
        dispatch,
    ),
});

const mapStateToProps = (state: any) => {
    const {game} = state.app;
    return {
        game
    };
};

const WrappedGameInfo = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GameInfo);


export default WrappedGameInfo;