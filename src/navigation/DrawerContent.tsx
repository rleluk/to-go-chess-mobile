import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
  Avatar,
  Drawer,
  Title,
  Caption,
} from 'react-native-paper';
import logout from "../utils/logout";
import {connect} from "react-redux";

import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const DrawerContent = ({navigation, user}: any) => {
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
                onPress={() => {}}
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
                onPress={() => {}}
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
                  navigation.navigate('Home');
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
                onPress={() => {}}
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
                label="Importuj / Eksportuj"
                onPress={() => {}}
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
  const {user, isLoading, isSignout, stackLoading} = state.app;
  return {
      user,
      isLoading,
      isSignout,
      stackLoading,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
});

const DrawerContentContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DrawerContent);

export default DrawerContentContainer;
