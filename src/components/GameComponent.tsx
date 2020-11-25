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
} from 'react-native';
import { Subject } from 'rxjs';
import { Game } from '../common/core/game';
import { Chessboard } from '../common/core/chessboard';
import { Player } from '../common/interfaces/player';
import { getMinWindowSize, getMaxWindowSize, getOrientation } from '../helpers/screen-info';
import {closeDialog, gameCreated, openDialog, gameObjectCreated, gameTreeUpdated} from "../actions";
import {SocketPlayer} from "../common/core/socket-player";
import {ChessButton} from "./ChessButton";
import {ChessPlayer} from '../common/core/chess-player';
import {MobileChessboard} from './MobileChessboard';
import ChessClockConfig from '../common/timer/chess-clock-config';
import GameTree from './GameTree';
import MenuBar from './MenuBar';

const config: ChessClockConfig = {
  initMsBlack: 360 * 1000,
  initMsWhite: 360 * 1000,
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
    chessboard: Chessboard;
    size: number;
    game: any;
}

interface Props {
    navigation: any;
    route: any;
    //actions
    closeDialog: any; gameCreated: any; openDialog: any; gameObjectCreated: any; gameTreeUpdated: any;
    //store
    newGame: any; config: any;
}

class GameComponent extends React.Component<Props, State> {
    color: 'white' | 'black';
    ws: WebSocket;
    mode: 'onlineGame' | 'twoPlayers' | 'singleGame';
    clearBoard: Subject<void> = new Subject<void>()

  constructor(props: any) {
    super(props);

    let chessboard = new Chessboard();

    this.state = {
        currentPlayer: null,
        chessboard: chessboard,
        size: getMinWindowSize(),
        game: null
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
        game.init({canvas: this.state.chessboard, whitePlayer: wp, blackPlayer: bp, chessClockConfig: config});

        this.props.gameObjectCreated(game);
        this.props.gameTreeUpdated(game.getTree().toSerializable());
        this.setState({
            currentPlayer: me,
            game
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
    const { 
      chessboard,
      currentPlayer,
      game,
      size
     } = this.state;

    const onMove = (move: string) => {
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
        this.props.gameTreeUpdated(game.getTree().toSerializable());
      }
        this.props.gameTreeUpdated(game.getTree().toSerializable());
    };
    
    const remainingSpace = getMaxWindowSize() - getMinWindowSize(); 
    return (
         <View style={styles.container}>
            <StatusBar hidden />
            <GameTree style={{ height: 0.6 * remainingSpace, width: size }}/>
            <MobileChessboard 
              clearBoard={this.clearBoard} 
              turn={this.color} 
              mode={this.mode}
              style={{ height: size, width: size }} 
              chessboard={chessboard} 
              onMove={onMove} 
            />
            <MenuBar 
              style={{height: 0.17 * remainingSpace, width: size}} 
              navigation={this.props.navigation}
            />

            <View style={{ height: 0.23 * remainingSpace, width: size, ...styles.playerInfo }}>
              <View style={styles.timersContainer}>
                  <Text style={styles.timer}> 05:00 </Text>
                  <Text style={styles.timer}> 05:00 </Text>
              </View>
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
            gameObjectCreated,
            gameTreeUpdated
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
