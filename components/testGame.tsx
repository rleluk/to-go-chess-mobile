import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {Subject} from 'rxjs';
import {Game} from '../common/core/game';
import {Chessboard} from '../common/core/chessboard';
import {Player} from '../common/interfaces/player';

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
  inputText: string;
  gameState: string;
}

interface Props {}

class TestGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let game = new Game();
    let chessboard = new Chessboard();
    let wp = new ChessPlayer();
    let bp = new ChessPlayer();
    game.init({canvas: chessboard, whitePlayer: wp, blackPlayer: bp});

    this.state = {
      currentPlayer: wp,
      whitePlayer: wp,
      blackPlayer: bp,
      inputText: '',
      chessboard: chessboard,
      gameState: '',
    };
  }

  render() {
    const {currentPlayer, chessboard, whitePlayer, blackPlayer, inputText, gameState} = this.state;
    const onButtonPress = () => {
        currentPlayer.move(inputText);
        this.setState({inputText: ''});
        if (currentPlayer === whitePlayer) this.setState({currentPlayer: blackPlayer});
        if (currentPlayer === blackPlayer) this.setState({currentPlayer: whitePlayer});
        this.setState({gameState: `${gameState}\n${chessboard.positionFEN}`});
    };

    return (
      <View>
        <TextInput
          value={inputText}
          style={styles.textInput}
          onChangeText={(text) => this.setState({inputText: text})}
        />
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <Text> Wykonaj ruch </Text>
        </TouchableOpacity>
        <ScrollView>
          <Text> {gameState} </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    marginTop: 50,
    alignSelf: 'center',
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    paddingHorizontal: 10,
    padding: 10,
    marginTop: 50,
  },
});

export default TestGame;
