import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Provider, connect} from 'react-redux';
import {createStore, applyMiddleware, bindActionCreators} from 'redux';
import thunk from 'redux-thunk';

import HomeScreen from './src/navigation/HomeScreen'
import {NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack'
import SignUpScreen from "./src/navigation/SignUpScreen";
import SignInScreen from "./src/navigation/SignInScreen";

import {restoreUser} from "./src/actions";

import reducer from './src/reducers';
import auth from "@react-native-firebase/auth";
import SplashScreen from "./src/navigation/SplashScreen";
const store = createStore(reducer, applyMiddleware(thunk));

const Stack = createStackNavigator();

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
        <Stack.Navigator>
            {props.isLoading ? (
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{headerShown: false}}
                />) :(
                <>
                    <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="Sign up" component={SignUpScreen} />
                    <Stack.Screen name="Sign in" component={SignInScreen} />
                </>)
            }
        </Stack.Navigator>
      </NavigationContainer>
  );
}

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
