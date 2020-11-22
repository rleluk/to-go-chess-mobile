import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Provider, connect} from 'react-redux';
import {createStore, applyMiddleware, bindActionCreators} from 'redux';
import thunk from 'redux-thunk';

import HomeScreen from './src/navigation/HomeScreen'
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from './src/navigation/DrawerContent';
import SignUpScreen from "./src/navigation/SignUpScreen";
import SignInScreen from "./src/navigation/SignInScreen";

import {restoreUser} from "./src/actions";

import reducer from './src/reducers';
import auth from "@react-native-firebase/auth";
import SplashScreen from "./src/navigation/SplashScreen";
import Dialog from "./src/components/Dialog"
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
        <Drawer.Navigator 
            drawerStyle={{  backgroundColor: '#f2f6e7', opacity: 0.9 }}
            drawerContent={props => <DrawerContent {...props}/>}
        >
            {props.isLoading ? (
                <Drawer.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{headerShown: false}}
                />) :(
                <>
                    <Drawer.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
                    <Drawer.Screen name="Sign up" component={SignUpScreen} />
                    <Drawer.Screen name="Sign in" component={SignInScreen} />
                </>)
            }
        </Drawer.Navigator>
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
