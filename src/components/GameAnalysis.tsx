import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    View,
    StatusBar,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';
import { Game } from '../common/core/game';
import { Chessboard } from '../common/core/chessboard';
import { getMinWindowSize, getMaxWindowSize } from '../helpers/screen-info';
import {closeDialog, analysisCreated, openDialog, gameObjectCreated, gameTreeUpdated, enableTreeMovement} from "../actions";
import {ChessButton} from "./ChessButton";
import {ChessPlayer} from '../common/core/chess-player';
import {MobileChessboard} from './MobileChessboard';
import GameTree from './GameTree';
import MenuBar from './MenuBar';
import SplashScreen from '../navigation/SplashScreen';

// mock clock
class ChessClock {
    startCountdown = () => {}
    switchClock = () => {}
    stopCountdown = () => {}
    getTimes = () => {}
};

interface State {
    size: number;
    game: any;
}

interface Props {
    navigation: any;
    route: any;
    //actions
    closeDialog: any; analysisCreated: any; openDialog: any; gameObjectCreated: any; gameTreeUpdated: any; enableTreeMovement: any;
    //store
    newAnalysis: boolean; movesPGN: string;
}

class GameAnalysis extends React.Component<Props, State> {
    color: 'white' | 'black';

    constructor(props: any) {
        super(props);

        this.state = {
            size: getMinWindowSize(),
            game: undefined,
        };

        Dimensions.addEventListener('change', () => this.setState({ size: getMinWindowSize() }));
    }

    componentDidMount() {
        if (this.props.newAnalysis) {
            if (this.props.movesPGN) {
                this.importGame(this.props.movesPGN);
            } else {
                this.newGame();
            }
            this.props.analysisCreated();
        }
    }

    componentDidUpdate() {
        if (this.props.newAnalysis) {
            if (this.props.movesPGN) {
                this.importGame(this.props.movesPGN);
            } else {
                this.newGame();
            }
            this.props.analysisCreated();
        }
    }

    importGame(moves) {
        console.log('importing game...')
        let chessboard = new Chessboard();
        let game = new Game();
        game.event.subscribe((event: any) => {
            if (event.type === 'mate') {
                this.onEndGame(event.data)
            }
        });
        const wp = new ChessPlayer();
        const bp = new ChessPlayer();
        let chessClock = new ChessClock();
        game.init({canvas: chessboard, whitePlayer: wp, blackPlayer: bp, chessClock});

        const movesArr = moves.split(' ');
        let turn = 3;
        for(let i = 0; i < movesArr.length; i++) {
            if (!(turn % 3)) {
                turn = 1;
                continue;
            }
            if (turn === 1) {
                wp.move(movesArr[i]);
            } 
            else if (turn === 2) {
                bp.move(movesArr[i]);
            }
            turn++;
        }

        this.props.gameObjectCreated(game);
        this.props.enableTreeMovement();
        this.props.gameTreeUpdated(game.getTree().toSerializable());
        this.setState({
            game,
        });
    }

    newGame() {
        console.log('initializing new game...')
        let chessboard = new Chessboard();
        let game = new Game();
        game.event.subscribe((event: any) => {
            if (event.type === 'mate') {
                this.onEndGame(event.data)
            }
        });
        const wp = new ChessPlayer();
        const bp = new ChessPlayer();
        let chessClock = new ChessClock();
        game.init({canvas: chessboard, whitePlayer: wp, blackPlayer: bp, chessClock});

        this.props.gameObjectCreated(game);
        this.props.enableTreeMovement();
        this.props.gameTreeUpdated(game.getTree().toSerializable());
        this.setState({
            game,
        });
    }

    onEndGame(status: string) {
        this.props.openDialog(
            <View>
                <Text style={{textAlign: 'center'}}>
                    {status === 'draw' && 'Remis'}
                    {status === 'white' && 'Wygrywają białe'}
                    {status === 'black' && 'Wygrywają czarne'}
                </Text>
                <ChessButton
                    onPress={() => {
                        this.props.closeDialog();
                        this.newGame();
                    }}
                    title={'Zagraj jeszcze raz'}
                />
            </View>
        )
    }

    render() {
        const {
            game,
            size,
        } = this.state;

        const onMove = (move: string) => {
            if (game.getTurn() === 'white') {
                game.whitePlayer.move(move);
            } else {
                game.blackPlayer.move(move);
            }
            this.props.gameTreeUpdated(game.getTree().toSerializable());
        };

        const remainingSpace = getMaxWindowSize() - getMinWindowSize();
        return (
            <>
            {
                game ? (
                    <View style={styles.container}>
                        <StatusBar hidden />
                        <GameTree style={{ height: 0.83 * remainingSpace, width: size }}/>
                        <MobileChessboard
                            turn={game.getTurn()}
                            mode='twoPlayers'
                            style={{ height: size, width: size }}
                            chessboard={game.getChessboard()}
                            onMove={onMove}
                        />
                        <MenuBar
                            style={{height: 0.17 * remainingSpace, width: size}}
                            navigation={this.props.navigation}
                        />
                    </View>
                ) : (
                    <SplashScreen style={{height: '100%', width: '100%'}}/>
                )
            }
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#2d0a0a'
    },
    console: {
        margin: 10,
        overflow: 'hidden',
        fontSize: 16
    },
});

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
            openDialog,
            closeDialog,
            analysisCreated,
            gameObjectCreated,
            gameTreeUpdated,
            enableTreeMovement
        },
        dispatch,
    ),
});

const mapStateToProps = (state: any) => {
    const {config, newAnalysis, movesPGN} = state.app;
    return {
        config,
        newAnalysis,
        movesPGN
    };
};

const WrappedGameAnalysis = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GameAnalysis);

export default WrappedGameAnalysis;
