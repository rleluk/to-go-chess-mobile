import React from 'react';
import { View, StatusBar, StyleSheet, Dimensions, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Subject } from 'rxjs';
import { Game } from '../common/core/game';
import { Chessboard } from '../common/core/chessboard';
import { Player } from '../common/interfaces/player';
import { MobileChessboard } from './MobileChessboard';
import { getMinWindowSize, getMaxWindowSize, getOrientation } from '../helpers/screen-info';

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
    currentPlayer: ChessPlayer;
    whitePlayer: ChessPlayer;
    blackPlayer: ChessPlayer;
    chessboard: Chessboard;
    size: number;
    moves: (Text | Element)[];
    moveCount: number;
    moveIterator: number;
}

interface Props {
  navigation: any;
}

class SinglePlayerGame extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    let game = new Game();
    let chessboard = new Chessboard();
    let wp = new ChessPlayer();
    let bp = new ChessPlayer();
    game.init({ canvas: chessboard, whitePlayer: wp, blackPlayer: bp });

    this.state = {
        currentPlayer: wp,
        whitePlayer: wp,
        blackPlayer: bp,
        chessboard: chessboard,
        size: getMinWindowSize(),
        moves: [],
        moveCount: 1,
        moveIterator: 1
    };

    Dimensions.addEventListener('change', () => this.setState({ size: getMinWindowSize() }));
  }

  render() {
    const { currentPlayer, chessboard, whitePlayer, blackPlayer, size, moves, moveIterator, moveCount } = this.state;

    const onMove = (move: string) => {
      currentPlayer.move(move);
      if (currentPlayer === whitePlayer)
        this.setState({ currentPlayer: blackPlayer });
      if (currentPlayer === blackPlayer)
        this.setState({ currentPlayer: whitePlayer });

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

            <MobileChessboard style={{ height: size, width: size }} chessboard={chessboard} onMove={onMove}></MobileChessboard>

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

export default SinglePlayerGame;
