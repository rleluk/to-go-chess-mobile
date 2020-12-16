import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    View,
    StatusBar,
    StyleSheet,
    Dimensions,
    Text, Image,
} from 'react-native';
import { Game } from '../common/core/game';
import { Chessboard } from '../common/core/chessboard';
import { Player } from '../common/interfaces/player';
import { getMinWindowSize, getMaxWindowSize, getOrientation } from '../helpers/screen-info';
import {
    closeDialog,
    gameCreated,
    openDialog,
    gameObjectCreated,
    gameTreeUpdated,
    disableTreeMovement,
    openToast, closeToast, gameInProgress, emoteSent
} from "../actions";
import {SocketPlayer} from "../common/core/socket-player";
import {ChessButton} from "./ChessButton";
import {ChessPlayer} from '../common/core/chess-player';
import MobileChessboard from './MobileChessboard';
import ChessClockConfig from '../common/timer/chess-clock-config';
import GameTree from './GameTree';
import MenuBar from './MenuBar';
import GameInfo from './GameInfo';
import SplashScreen from '../navigation/SplashScreen';
import emotes from "../utils/emotes";

const clockConfig: ChessClockConfig = {
    initMsBlack: 300 * 1000,
    initMsWhite: 10 * 1000,
    stepBlack: 1,
    stepWhite: 1,
    mode: {
        type: 'standard',
    },
    endCallback: (winner: string) => {
        console.log(winner + 'wins');
    }
}

interface State {
    currentPlayer: ChessPlayer | null;
    size: number;
    game: any;
}

interface Props {
    navigation: any;
    route: any;
    //actions
    closeDialog: any; gameCreated: any; openDialog: any; gameObjectCreated: any; gameTreeUpdated: any; disableTreeMovement: any;
    openToast: any; closeToast: any; gameInProgress: any; emoteSent: any;
    //store
    newGame: any; config: any; status: any, emoteToSend: any;
}

class GameComponent extends React.Component<Props, State> {
    color: 'white' | 'black';
    ws: WebSocket;
    mode: 'onlineGame' | 'twoPlayers' | 'singleGame';
    me: ChessPlayer;
    opponentDraw: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            currentPlayer: undefined,
            size: getMinWindowSize(),
            game: undefined,
        };

        Dimensions.addEventListener('change', () => this.setState({ size: getMinWindowSize() }));
    }

    componentDidMount() {
        this.mode = 'twoPlayers';
        this.newGame(undefined, 'standard');
    }

    componentDidUpdate(prevProps:Readonly<Props>) {
        if (this.props.newGame) {
            if (this.state.game) {
                this.state.game.stopClock();
            }
            this.mode = this.props.config.mode;
            this.newGame();
            this.props.gameCreated();
        }
        if (prevProps.status !== 'drawOffered' && this.props.status === 'drawOffered') {
            this.me.move('draw');
        }
        if (prevProps.status === 'drawOffered' && this.props.status !== 'drawOffered') {
            this.props.closeToast();
        }
        if (prevProps.status !== 'surrendered' && this.props.status === 'surrendered') {
            this.me.move('surrender');
        }
        if (this.props.emoteToSend !== undefined) {
            if (this.ws) {
                this.ws.send(JSON.stringify({type: 'emote', emote: this.props.emoteToSend}));
            }
            this.props.emoteSent();
        }
    }

    componentWillUnmount() {
        if (this.state.game) {
            this.state.game.stopClock();
        }
    }

    newGame(newColor?: string, newClockType?: string) {
        if (this.props.status !== 'inProgress') {
            this.props.gameInProgress();
        }
        if (this.mode === 'onlineGame') {
            this.newOnlineGame(newColor || this.props.config.color, newClockType || this.props.config.clockType);
        }
        else if (this.mode === 'twoPlayers') {
            this.color = 'white'
            this.init(new ChessPlayer(), newClockType || this.props.config.clockType);
        }
        else if (this.mode === 'singleGame') {
            this.color = 'white'
            this.newOnlineAiGame(newColor || this.props.config.color, newClockType || this.props.config.clockType);
        }
    }

    newOnlineGame(color: string, clockType: string) {
        if (this.opponentDraw) {
            this.opponentDraw = false;
            this.props.closeToast();
        }
        this.props.openDialog(
            <Text>
                Oczekiwanie na przeciwnika...
            </Text>
            , () => {
                this.ws.close();
            }
        )
        this.ws = new WebSocket('ws://to-go-chess-sockets.herokuapp.com/')
        this.ws.onerror = (event) => {
            console.log(event)
            if (event.message) {
                this.props.openDialog(
                    <Text>
                        Błąd połączenia...
                    </Text>
                )
            }
        }
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({type: 'newGame', color, clockType}));
        }
        this.ws.onmessage = (event) => {
            let msg = JSON.parse(String(event.data));
            if (msg.type === 'config') {
                this.props.closeDialog();
                this.color = msg.color;
                this.init(new SocketPlayer(this.ws), clockType);
                /****  DANGEROUS  ******/
                const socketOnMessage = this.ws.onmessage;
                this.ws.onmessage = (event) => {
                    socketOnMessage.call(this.ws, event);
                    let msg = JSON.parse(String(event.data));
                    if (msg.type === 'emote') {
                        const emote = emotes.find(emote => emote.index === msg.emote);
                        if (emote) {
                            this.props.openToast(<Image  source={emote.res} style={{width: 60, height: 60}} />, {fade: true});
                        }
                    }
                }
                /********** ********/
            }
        };
    }

    newOnlineAiGame(color: string, clockType: string) {
        this.props.openDialog(
            <Text>
                Oczekiwanie na połączenie...
            </Text>
            , () => {
                this.ws.close();
            }
        )
        this.ws = new WebSocket('ws://to-go-chess-sockets.herokuapp.com/')
        this.ws.onerror = (event) => {
            console.log(event)
            if (event.message) {
                this.props.openDialog(
                    <Text>
                        Błąd połączenia...
                    </Text>
                )
            }
        }
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({type: 'newAiGame', color}));
        }
        this.ws.onmessage = (event) => {
            let msg = JSON.parse(String(event.data));
            if (msg.type === 'config') {
                this.props.closeDialog();
                this.color = msg.color;
                this.init(new SocketPlayer(this.ws), clockType);
            }
        };
    }

    init(opponent: Player, clockType: string) {
        console.log('init')
        let chessboard = new Chessboard();
        let game = new Game();
        game.event.subscribe((event: any) => {
            if (event.type === 'mate') {
                this.onEndGame(event.data)
            }
            else if (event.type === 'draw') {
                this.onEndGame('draw');
            }
            else if (event.type === 'draw_offer' && this.me.color !== event.data) {
                this.opponentDraw = true;
                this.props.openToast(
                    <View>
                        <Text>Przeciwnik proponuje remis.</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <ChessButton onPress={() => {
                                console.log('draw')
                                this.me.move('draw');
                                this.props.closeToast();
                            }}
                                         title={'Akceptuj'} />
                            <ChessButton onPress={() => this.props.closeToast()} title={'Odrzuć'} />
                        </View>
                    </View>
                );
            }
            else if (event.type === 'surrender') {
                this.onEndGame(this.me.color === event.data ? 'me_surrender' : 'opponent_surrender');
            }
        });
        this.me = new ChessPlayer();
        const me = this.me;

        /****  DANGEROUS  ******/
        const superReceiveMove = me.receiveMove;
        me.receiveMove = (move: string) => {
            superReceiveMove(move);
            if (this.opponentDraw) {
                this.opponentDraw = false;
                this.props.closeToast();
            }
            if (this.props.status !== 'inProgress') {
                this.props.gameInProgress();
            }
        }
        /********** ********/

        let wp;
        let bp;
        if (this.color === 'white') {
            wp = me;
            bp = opponent;
        }
        else {
            wp = opponent;
            bp = me;
        }
        clockConfig.endCallback = (winner: string) => {
            this.onEndGame(winner);
        }
        clockConfig.mode = {
            type: clockType ? clockType : 'standard',
            toAdd: 5000
        }
        game.init({canvas: chessboard, whitePlayer: wp, blackPlayer: bp, chessClockConfig: clockConfig});
        if (this.mode === 'onlineGame') {
            // @ts-ignore
            opponent.setChessClock(game.getChessClock());
        }
        this.props.gameObjectCreated(game);
        this.props.disableTreeMovement();
        console.log('disabling tree movement')
        this.props.gameTreeUpdated(game.getTree().toSerializable());
        this.setState({
            currentPlayer: me,
            game,
        });
    }

    onEndGame(status: string) {
        this.props.openDialog(
            <View>
                <Text style={{textAlign: 'center'}}>
                    {status === 'draw' && 'Partia zakończona remisem'}
                    {status === 'white' && 'Wygrywają białe'}
                    {status === 'black' && 'Wygrywają czarne'}
                    {status === 'me_surrender' && 'Poddałeś się'}
                    {status === 'opponent_surrender' && 'Przeciwnik się poddał'}
                </Text>
                <ChessButton
                    onPress={() => {
                        const color = this.color === 'white' ? 'black' : 'white';
                        this.props.closeDialog();
                        this.newGame(color, clockConfig.mode.type);
                    }}
                    title={'Zagraj jeszcze raz'}
                />
            </View>
        )
    }

    render() {
        const {
            currentPlayer,
            game,
            size,
        } = this.state;

        const onMove = (move: string) => {
            if (this.opponentDraw) {
                this.opponentDraw = false;
                this.props.closeToast();
            }
            if (this.props.status !== 'inProgress') {
                this.props.gameInProgress();
            }
            if (this.mode === 'onlineGame' || this.mode === 'singleGame') {
                currentPlayer.move(move);
            }
            else {
                if (game.getTurn() === 'white') {
                    game.whitePlayer.move(move);
                    this.color = 'black';
                } else {
                    game.blackPlayer.move(move);
                    this.color = 'white';
                }
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
                    <GameTree style={{ height: 0.6 * remainingSpace, width: size }}/>
                    <MobileChessboard
                        turn={this.color}
                        mode={this.mode}
                        style={{ height: size, width: size }}
                        chessboard={game.getChessboard()}
                        onMove={onMove}
                    />
                    <MenuBar
                        style={{height: 0.17 * remainingSpace, width: size}}
                        navigation={this.props.navigation}
                    />
                    <GameInfo style={{ height: 0.23 * remainingSpace, width: size }}/>
                </View>
                ) : (
                    <SplashScreen style={{height: '100%', width: '100%'}}/>
                )}
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
            gameCreated,
            gameObjectCreated,
            gameTreeUpdated,
            disableTreeMovement,
            openToast,
            closeToast,
            gameInProgress,
            emoteSent,
        },
        dispatch,
    ),
});

const mapStateToProps = (state: any) => {
    const {config, newGame, status, emoteToSend} = state.app;
    return {
        config,
        newGame,
        status,
        emoteToSend,
    };
};

const WrappedGameComponent = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GameComponent);


export default WrappedGameComponent;
