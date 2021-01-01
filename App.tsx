import React, {useEffect, useState} from 'react';
import {StyleSheet, StatusBar} from 'react-native';

import {Provider, connect} from 'react-redux';
import {createStore, applyMiddleware, bindActionCreators} from 'redux';
import thunk from 'redux-thunk';

import GameScreen from './src/navigation/GameScreen'
import {NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from './src/navigation/DrawerContent';
import SignUpScreen from './src/navigation/SignUpScreen';
import SignInScreen from './src/navigation/SignInScreen';
import AnalysisScreen from './src/navigation/AnalysisScreen';
import SettingsScreen from './src/navigation/SettingsScreen';

import {restoreUser} from "./src/actions";

import reducer from './src/reducers';
import auth from "@react-native-firebase/auth";
import SplashScreen from "./src/navigation/SplashScreen";
import Dialog from "./src/components/Dialog"
import Toast from "./src/components/Toast"
const store = createStore(reducer, applyMiddleware(thunk));

const Drawer = createDrawerNavigator();

function App(props: any) {

    function onAuthStateChanged(user: any) {
        props.restoreUser(user);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);


    return (
      <NavigationContainer>
        <Dialog />
        <StatusBar hidden/>
        <Drawer.Navigator
            drawerStyle={{  backgroundColor: 'rgba(223, 193, 157, 0.9)'}}
            drawerContent={props => <DrawerContent {...props}/>}
        >
            {
                props.isLoading ? (
                <Drawer.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{headerShown: false}}
                />) : (<>
                    <Drawer.Screen name="Analysis" component={AnalysisScreen} options={{headerShown: false, unmountOnBlur: true}}/>
                    <Drawer.Screen name="Game" component={GameScreen} options={{headerShown: false, unmountOnBlur: true}}/>
                    <Drawer.Screen name="Sign up" component={SignUpScreen} options={{headerTitle: "Rejestracja", headerStyle: styles.header, unmountOnBlur: true}}/>
                    <Drawer.Screen name="Sign in" component={SignInScreen} options={{headerTitle: "Logowanie", headerStyle: styles.header, unmountOnBlur: true}}/>
                    <Drawer.Screen name="Settings" component={SettingsScreen} options={{headerTitle: "Ustawienia", headerStyle: styles.header, unmountOnBlur: true}}/>
                </>)
            }
        </Drawer.Navigator>
        <Toast />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'rgba(223, 193, 157, 0.8)',
    },
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
    ...bindActionCreators(
        {
            restoreUser,
        },
        dispatch,
    ),
});

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);

export default (() => (
    <Provider store={store}>
        <AppContainer />
    </Provider>
));
