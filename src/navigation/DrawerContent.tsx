import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Button, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
  Avatar,
  Drawer,
  Title,
  Caption,
} from 'react-native-paper';
import logout from "../utils/logout";
import {connect} from "react-redux";
import * as RNFS from 'react-native-fs';
import FilenameInput from '../components/FilenameInput';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {bindActionCreators} from "redux";
import {closeDialog, createGame, gameCreated, openDialog, createAnalysis, drawOffer, surrender} from "../actions";
import {getComponentBySymbol} from '../helpers/get-component';
import firestore from '@react-native-firebase/firestore';
import {ChessButton} from "../components/ChessButton";

const DrawerContent = ({navigation, user, createGame, openDialog, drawOffer, surrender, createAnalysis, closeDialog, game, config}: any) => {
  const chooseClockType = (mode: string, color: string) => {
    openDialog(
      <View>
        <Text style={{textAlign: 'center', paddingBottom: 5}}>Wybierz tryb czasowy</Text>
        <View style={styles.clockTypeBar}>
          <TouchableOpacity style={styles.clockType} onPress={() => {
            closeDialog();
            createGame({mode, color, clockType: 'standard'});
            navigation.navigate('Home');
          }} >
            <Text style={{fontWeight: 'bold', color: 'brown'}}>Standard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clockType} onPress={() => {
            closeDialog();
            createGame({mode, color, clockType: 'fischer'});
            navigation.navigate('Home');
          }}>
            <Text style={{fontWeight: 'bold', color: 'brown'}}>Fischer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const chooseConfig = (mode: string) => {
    openDialog(
      <View>
        <Text style={{textAlign: 'center'}}>Wybierz kolor</Text>
        <View style={styles.piecesBar}>
          <TouchableOpacity style={styles.piece} onPress={() => {
            closeDialog();
            chooseClockType(mode, 'white');
          }} >{ getComponentBySymbol('K') }</TouchableOpacity>
          <TouchableOpacity style={styles.doublePiece} onPress={() => {
            closeDialog();
            chooseClockType(mode, 'random');
          }} >
            <View style={styles.halfPiece}>
              <View style={styles.piece}>
                { getComponentBySymbol('K') }
              </View>
            </View>
            <View style={styles.halfPiece}>
              <View style={styles.halfBlackPiece}>
                { getComponentBySymbol('k') }
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.piece} onPress={() => {
            closeDialog();
            chooseClockType(mode, 'black');
          }} >{ getComponentBySymbol('k') }</TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const exportPGN = () => {
    const contents = game.getTree().toPGN();
    if (contents) {
      let refInput;
      const placeholder = 'Brak nazwy';
      const db = firestore();
      const onPress = (filename) => {
        if (filename !== '') {
          RNFS.writeFile(RNFS.DocumentDirectoryPath + '/' + filename + '.pgn', contents, 'ascii')
              .catch(err => console.log(err));
          closeDialog();
        }
      }
      openDialog(
          <>
            {user ?
                <>
                  <TextInput placeholder={placeholder} onChangeText={text => refInput = text}/>
                  <ChessButton onPress={() => {
                    console.log(refInput)
                    db.collection('users').doc(user.uid).collection('games').add({
                      name: refInput ? refInput : placeholder,
                      pgn: contents
                    }).then(() => {
                      openDialog(<Text>Pomyślnie zapisaono partię.</Text>);
                    }).catch(() => {
                      openDialog(<Text>Błąd, nie udało się zapisać partii.</Text>);
                    });
                    openDialog(<Text>Zapisywanie...</Text>);
                  }}
                  title={'Zapisz na koncie'}/>
                </>
                : <Text style={{color: '#606060aa', margin: 10, fontSize: 12}}>Zaloguj się aby zapisać dane na koncie.</Text>
            }
            <FilenameInput buttonText="Zapisz w pamięci telefonu" onPress={game ? onPress : undefined} style={{width: 200}}/>
          </>
      );
    }
    else {
      openDialog(<Text>Brak danych do wyeksportowania.</Text>);
    }
  };

  const importPGN = () => {
    const db = firestore();
    const List = () => {
      const [list, setList] = useState([])
      const [isLoading, setIsLoading] = useState(true)
      useEffect(() => {
        const array = [];
        db.collection('users').doc(user.uid).collection('games').get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            const {name, pgn} = doc.data();
            array.push(
                <View key={doc.id} style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#707070'}}>
                  <View style={{flexGrow: 1, maxWidth: 230}}><Text style={{flex: 1, fontWeight: "bold", flexWrap: 'wrap'}}>{name}</Text></View>
                  <ChessButton onPress={() => {
                    closeDialog();
                    createAnalysis(pgn);
                    navigation.navigate('Analysis');
                  }} title={'Wczytaj'}/>
                </View>
            );
          })
          setList(array);
          setIsLoading(false);
        });
      }, []);
      return <>{isLoading ? <Text>Ładowanie...</Text> : <ScrollView style={{maxHeight: 350, maxWidth: 300}}>{list}</ScrollView>}</>
    };
    const onPress = (filename) => {
      if (filename !== '') {
        RNFS.readFile(RNFS.DocumentDirectoryPath + '/' + filename + '.pgn', 'ascii')
          .then(res => {
            closeDialog();
            createAnalysis(res);
            navigation.navigate('Analysis');
          })
          .catch(err => {
            console.log(err);
            openDialog(
              <Text style={{padding: 10}}>
                Brak takiego pliku!
              </Text>
            )
          });
      }
    }
    openDialog(
        <>
          {user ?
              <>
                <List />
              </>
              : <Text style={{color: '#606060aa', margin: 10, fontSize: 12}}>Zaloguj się aby wczytać zapisaną partię.</Text>
          }
        <FilenameInput buttonText="Importuj z pamięci" onPress={onPress} style={{width: 200}}/>
        </>
    );
  };


  return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView>
          <View style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <Avatar.Image source={require('../images/guest.png')} size={60} />
                <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                  <Title style={styles.title}>John Doe</Title>
                  <Caption style={styles.caption}>1222</Caption>
                </View>
              </View>
            </View>
            <Drawer.Section>
              {(config && config.mode === 'onlineGame') &&
              <View style={styles.drawerSection}>
                <DrawerItem
                    style={{...styles.inGameOptions, ...styles.boxShadow}}
                    icon={({color, size}) => (
                        <MaterialCommunityIcon
                            name="handshake"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Zaproponuj remis"
                    onPress={() => {
                      drawOffer();
                      navigation.navigate('Home');
                    }}
                />
                <DrawerItem
                    style={{...styles.inGameOptions, ...styles.boxShadow}}
                    icon={({color, size}) => (
                        <FontAwesome5Icon
                            name="chess-king"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Poddaj się"
                    onPress={() => {
                      surrender();
                      navigation.navigate('Home');
                    }}
                />
              </View>}
              <View style={styles.drawerSection}>
                <DrawerItem
                    style={{...styles.newGameOptions, ...styles.boxShadow}}
                    icon={({color, size}) => (
                        <MaterialIcon
                            name="computer"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Gra z komputerem"
                    labelStyle={styles.labelStyle}
                    onPress={ () => {
                      chooseConfig('singleGame');
                    }}
                />
                <DrawerItem
                    style={{...styles.newGameOptions, ...styles.boxShadow}}
                    icon={({color, size}) => (
                        <IonIcon
                            name="person"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Gra online"
                    labelStyle={styles.labelStyle}
                    onPress={ () => {
                      chooseConfig('onlineGame');
                    }}
                />
                <DrawerItem
                    style={{...styles.newGameOptions, ...styles.boxShadow}}
                    icon={({color, size}) => (
                        <IonIcon
                            name="people"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Dwoje graczy"
                    labelStyle={styles.labelStyle}
                    onPress={ () => {
                      chooseClockType('twoPlayers', 'white');
                    }}
                />
              </View>
              <View style={styles.drawerSection}>
                <DrawerItem
                    style={{...styles.otherOptions, ...styles.boxShadow}}
                    icon={({color, size}) => (
                        <MaterialCommunityIcon
                            name="google-analytics"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Analiza partii"
                    labelStyle={styles.labelStyle}
                    onPress={() => {
                      createAnalysis();
                      navigation.navigate('Analysis');
                    }}
                />
                <DrawerItem
                    style={{...styles.otherOptions, ...styles.boxShadow}}
                    icon={({color, size}) => (
                        <MaterialCommunityIcon
                            name="database-import"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Importuj"
                    labelStyle={styles.labelStyle}
                    onPress={() => importPGN()}
                />
                <DrawerItem
                    style={{...styles.otherOptions, ...styles.boxShadow}}
                    icon={({color, size}) => (
                        <MaterialCommunityIcon
                            name="database-export"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Eksportuj"
                    labelStyle={styles.labelStyle}
                    onPress={() => exportPGN()}
                />
                <DrawerItem
                    style={{...styles.otherOptions, ...styles.boxShadow}}
                    icon={({color, size}) => (
                        <IonIcon
                            name="settings"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Ustawienia"
                    labelStyle={styles.labelStyle}
                    onPress={() => navigation.navigate('Settings')}
                />
              </View>
            </Drawer.Section>
          </View>
          <View style={styles.drawerSection}>
            {user ? (
                <DrawerItem style={{...styles.bottomDrawerOptions, ...styles.boxShadow}}
                            icon={({ color, size }) => (
                                <IonIcon name="exit-outline" color={color} size={size} />
                            )}
                            label="Wyloguj się"
                            labelStyle={styles.labelStyle}
                            onPress={logout}
                />) : (
                <DrawerItem style={{...styles.bottomDrawerOptions, ...styles.boxShadow}}
                            icon={({ color, size }) => (
                                <IonIcon name="enter-outline" color={color} size={size} />
                            )}
                            label="Zaloguj się"
                            labelStyle={styles.labelStyle}
                            onPress={() => {
                              navigation.navigate('Sign in');
                            }}
                />)
            }
          </View>
        </DrawerContentScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  clockTypeBar: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockType: {
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  piecesBar: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  piece: {
    width: 46,
    height: 46,
  },
  halfPiece: {
    width: 23,
    height: 46,
    overflow: "hidden",
  },
  halfBlackPiece: {
    width: 46,
    height: 46,
    left: -23,
  },
  doublePiece: {
    width: 46,
    height: 46,
    flexDirection: 'row',
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  drawerSection: {
    paddingTop: 10,

    marginVertical: 10
  },
  bottomDrawerOptions: {
    marginLeft: 0,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#707070',
    backgroundColor: '#faffc4',
  },
  newGameOptions: {
    marginLeft: 0,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#707070',
    backgroundColor: '#b8e5f3',
  },
  inGameOptions: {
    marginLeft: 0,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#707070',
    backgroundColor: '#caebc0',
  },
  otherOptions: {
    marginLeft: 0,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#707070',
    backgroundColor: '#ecead1',
  },
  labelStyle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#707070'
  },
  boxShadow: {
    shadowColor: "#707070",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

const mapStateToProps = (state: any) => {
  const {user, isLoading, isSignout, stackLoading, game, config} = state.app;
  return {
    user,
    isLoading,
    isSignout,
    stackLoading,
    game,
    config
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
      {
        createGame,
        gameCreated,
        openDialog,
        closeDialog,
        createAnalysis,
        drawOffer,
        surrender,
      },
      dispatch,
  ),
});

const DrawerContentContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DrawerContent);

export default DrawerContentContainer;
