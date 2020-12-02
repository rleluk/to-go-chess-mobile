import React from 'react';
import {View, StyleSheet, Text, Button, TouchableOpacity} from 'react-native';
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
import {closeDialog, createGame, gameCreated, openDialog, createAnalysis} from "../actions";
import {getComponentBySymbol} from '../helpers/get-component';

const DrawerContent = ({navigation, user, createGame, openDialog, createAnalysis, closeDialog, game}: any) => {
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
    const onPress = (filename) => {
      if (filename !== '') {
        const contents = game.getTree().toPGN();
        RNFS.writeFile(RNFS.DocumentDirectoryPath + '/' + filename + '.pgn', contents, 'ascii')
          .catch(err => console.log(err));
        closeDialog();
      }
    }
    openDialog(<FilenameInput buttonText="Eksportuj" onPress={game ? onPress : undefined} style={{width: 200}}/>)
  };

  const importPGN = () => {
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
    openDialog(<FilenameInput buttonText="Importuj" onPress={onPress} style={{width: 200}}/>)
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
              <View style={styles.drawerSection}>
                <DrawerItem
                    style={styles.inGameOptions}
                    icon={({color, size}) => (
                        <MaterialCommunityIcon
                            name="handshake"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Zaproponuj remis"
                    onPress={() => {}}
                />
                <DrawerItem
                    style={styles.inGameOptions}
                    icon={({color, size}) => (
                        <FontAwesome5Icon
                            name="chess-king"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Poddaj się"
                    onPress={() => {}}
                />
              </View>
              <View style={styles.drawerSection}>
                <DrawerItem
                    style={styles.newGameOptions}
                    icon={({color, size}) => (
                        <MaterialIcon
                            name="computer"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Gra z komputerem"
                    onPress={ () => {
                      chooseConfig('singleGame');
                    }}
                />
                <DrawerItem
                    style={styles.newGameOptions}
                    icon={({color, size}) => (
                        <IonIcon
                            name="person"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Gra online"
                    onPress={ () => {
                      chooseConfig('onlineGame');
                    }}
                />
                <DrawerItem
                    style={styles.newGameOptions}
                    icon={({color, size}) => (
                        <IonIcon
                            name="people"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Dwoje graczy"
                    onPress={ () => {
                      chooseClockType('twoPlayers', 'white');
                    }}
                />
              </View>
              <View style={styles.drawerSection}>
                <DrawerItem
                    style={styles.otherOptions}
                    icon={({color, size}) => (
                        <MaterialCommunityIcon
                            name="google-analytics"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Analiza partii"
                    onPress={() => {
                      createAnalysis();
                      navigation.navigate('Analysis');
                    }}
                />
                <DrawerItem
                    style={styles.otherOptions}
                    icon={({color, size}) => (
                        <MaterialCommunityIcon
                            name="database-import"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Importuj"
                    onPress={() => importPGN()}
                />
                <DrawerItem
                    style={styles.otherOptions}
                    icon={({color, size}) => (
                        <MaterialCommunityIcon
                            name="database-export"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Eksportuj"
                    onPress={() => exportPGN()}
                />
                <DrawerItem
                    style={styles.otherOptions}
                    icon={({color, size}) => (
                        <IonIcon
                            name="settings"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Ustawienia"
                    onPress={() => {}}
                />
              </View>
            </Drawer.Section>
          </View>
          <View style={styles.drawerSection}>
            {user ? (
                <DrawerItem style={styles.bottomDrawerOptions}
                            icon={({ color, size }) => (
                                <IonIcon name="exit-outline" color={color} size={size} />
                            )}
                            label="Wyloguj się"
                            onPress={logout}
                />) : (
                <DrawerItem style={styles.bottomDrawerOptions}
                            icon={({ color, size }) => (
                                <IonIcon name="enter-outline" color={color} size={size} />
                            )}
                            label="Zaloguj się"
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
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#faffc4'
  },
  newGameOptions: {
    marginLeft: 0,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#b8e5f3'
  },
  inGameOptions: {
    marginLeft: 0,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#caebc0'
  },
  otherOptions: {
    marginLeft: 0,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#ecead1'
  }
});

const mapStateToProps = (state: any) => {
  const {user, isLoading, isSignout, stackLoading, game} = state.app;
  return {
    user,
    isLoading,
    isSignout,
    stackLoading,
    game
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
      },
      dispatch,
  ),
});

const DrawerContentContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DrawerContent);

export default DrawerContentContainer;
