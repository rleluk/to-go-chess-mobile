import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    View,
    StatusBar,
    StyleSheet,
    Dimensions,
    Text,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Button
} from 'react-native';
import { Subject } from 'rxjs';
import { Game } from '../common/core/game';
import { Chessboard } from '../common/core/chessboard';
import { Player } from '../common/interfaces/player';
import { MobileChessboard } from './MobileChessboard';
import { getMinWindowSize, getMaxWindowSize, getOrientation } from '../helpers/screen-info';
import {closeDialog, gameCreated, openDialog} from "../actions";
import {SocketPlayer} from "../common/core/socket-player";
import {ChessButton} from "./ChessButton";

class ChessPlayer implements Player {
    color: 'white' | 'black';
    emitMove: Subject<string> = new Subject<string>();

    move(move: string) {
        this.emitMove.next(move);
    }

    receiveMove(move: string) {
        console.log(this.color + ' player received: ' + move);
    }
}

interface State {
    currentPlayer: ChessPlayer | null;
    whitePlayer: ChessPlayer | null;
    blackPlayer: ChessPlayer | null;
    chessboard: Chessboard;
    size: number;
    moves: (Text | Element)[];
    moveCount: number;
    moveIterator: number;
}

interface Props {
    navigation: any;
    route: any;
    //actions
    closeDialog: any; gameCreated: any; openDialog: any;
    //store
    newGame: any; config: any;
}

class GameComponent extends React.Component<Props, State> {
    color: 'white' | 'black';
    ws: WebSocket;
    mode: string;
    clearBoard: Subject<void> = new Subject<void>()

  constructor(props: any) {
    super(props);

    let chessboard = new Chessboard();

    this.state = {
        currentPlayer: null,
        whitePlayer: null,
        blackPlayer: null,
        chessboard: chessboard,
        size: getMinWindowSize(),
        moves: [],
        moveCount: 1,
        moveIterator: 1
    };

    Dimensions.addEventListener('change', () => this.setState({ size: getMinWindowSize() }));
  }

    componentDidMount() {
        this.mode = 'twoPlayers';
        this.newGame();
    }

    componentDidUpdate() {
        if (this.props.newGame) {
            this.mode = this.props.config.mode;
            this.newGame();
            this.props.gameCreated();
        }
    }

    newGame(newColor?: string) {
        this.clearBoard.next();
        if (this.mode === 'onlineGame') {
            this.newOnlineGame(newColor || this.props.config.color);
        }
        else if (this.mode === 'twoPlayers') {
            this.color = 'white'
            this.init(new ChessPlayer());
        }
    }
    newOnlineGame(color: string) {
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
            this.props.openDialog(
                <Text>
                    Błąd połączenia...
                </Text>
            )
        }
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({type: 'newGame', color}));
        }
        this.ws.onmessage = (event) => {
            let msg = JSON.parse(String(event.data));
            if (msg.type === 'config') {
                this.props.closeDialog();
                this.color = msg.color;
                this.init(new SocketPlayer(this.ws));
            }
        };
    }

    init(opponent: Player) {
        console.log('init')
        let game = new Game();
        game.event.subscribe((event: any) => {
            if (event.type === 'mate') {
                this.onEndGame(event.data)
            }
        });
        const me = new ChessPlayer();
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
        game.init({canvas: this.state.chessboard, whitePlayer: wp, blackPlayer: bp});

        this.setState({
            currentPlayer: me,
            whitePlayer: wp,
            blackPlayer: bp,
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
                        const color = this.color === 'white' ? 'black' : 'white';
                        this.props.closeDialog();
                        this.newGame(color);
                    }}
                    title={'Zagraj jeszcze raz'}
                />
            </View>
        )
    }

  render() {
    const { currentPlayer, chessboard, whitePlayer, blackPlayer, size, moves, moveIterator, moveCount } = this.state;

    const onMove = (move: string) => {
      if (currentPlayer) currentPlayer.move(move);
        if (this.mode === 'twoPlayers') {
            if (currentPlayer === whitePlayer) {
                this.color = 'black';
                this.setState({currentPlayer: blackPlayer});
            }
            if (currentPlayer === blackPlayer) {
                this.color = 'white';
                this.setState({currentPlayer: whitePlayer});
            }
        }

      if (moveCount >= 1) {
        this.setState({ 
          moveCount: 0, 
          moveIterator: moveIterator + 1,
          moves: [...moves, <Text key={moveCount.toString() + moveIterator} style={{fontWeight: '200'}}><Text style={{fontWeight: 'bold', fontSize: 17}}>{moveIterator}.</Text> {move} </Text> ]
        });
      } else {
        this.setState({ 
          moveCount: moveCount + 1, 
          moves: [...moves, <Text key={moveCount.toString() + moveIterator} style={{fontWeight: '200'}}> {move}  </Text> ]
        });
      }
    };

    const remainingSpace = getMaxWindowSize() - getMinWindowSize(); 

    return (
         <View style={styles.container}>
            <StatusBar hidden />
            <ImageBackground resizeMode='stretch' source={require('../images/texture_of_burnt_wood.png')} style={{ height: 0.6 * remainingSpace, width: size }}>
              <ScrollView>
                <Text style={styles.console}>{moves}</Text>
              </ScrollView>
            </ImageBackground>

            <MobileChessboard clearBoard={this.clearBoard} turn={this.color} style={{ height: size, width: size }} chessboard={chessboard} onMove={onMove} />

            <ImageBackground resizeMode='contain' source={require('../images/bottom_buttons.png')} style={{ height: 0.17 * remainingSpace, width: size, ...styles.buttonContainer }}>
              <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.openDrawer()}/>
              <TouchableOpacity style={styles.button} onPress={() => console.log("Go move back button pressed.")}/>
              <TouchableOpacity style={styles.button} onPress={() => console.log("Go move next button pressed.")}/>
              <TouchableOpacity style={styles.button} onPress={() => console.log("Refresh button pressed.")}/>
              <TouchableOpacity style={styles.button} onPress={() => console.log("Smiley face button pressed.")}/>
            </ImageBackground>

            <View style={{ height: 0.23 * remainingSpace, width: size, ...styles.playerInfo }}>
              <View style={styles.timersContainer}>
                  <Text style={styles.timer}> 05:00 </Text>
                  <Text style={styles.timer}> 05:00 </Text>
              </View>
              {/* <View style={styles.gameType}>
                <Text style={{color: '#707070', fontSize: 12}}>
                  Offline game
                </Text>
              </View> */}
              <View style={styles.playerContainer}>
                  <View style={styles.whiteBox}/>
                  <Text style={styles.player}>Player 1</Text>
                  <Text style={styles.player}>Player 2</Text>
                  <View style={styles.blackBox}/>
              </View>
            </View>
        </View>
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
  buttonContainer: {
    flexDirection: 'row'
  },
  button: {
    width: '20%',
  },
  console: {
    margin: 10,
    overflow: 'hidden',
    fontSize: 16
  },
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
  gameType: {
    flex: 0.5,
    alignSelf: 'center',
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
            openDialog,
            closeDialog,
            gameCreated,
        },
        dispatch,
    ),
});

const mapStateToProps = (state: any) => {
    const {config, newGame} = state.app;
    return {
        config,
        newGame,
    };
};

const WrappedGameComponent = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GameComponent);


export default WrappedGameComponent;
