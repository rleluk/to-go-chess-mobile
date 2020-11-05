import React, {useState} from 'react';
import {Text, Button, StyleSheet, View, TextInput} from "react-native";
import auth from '@react-native-firebase/auth';
import {bindActionCreators} from "redux";
import {loaded, loading} from "../actions";
import {connect} from "react-redux";


const SignUpScreen = ({navigation, loading, loaded}: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const authentication = (email: string, password: string) => {
        loading('Login');
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account created & signed in!');
                navigation.navigate('Home');
                loaded('Login');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.log(error);
                loaded('Login');
            });
    }

    return (
        <>
            <TextInput
                placeholder={"E-mail"}
                onChangeText={text => setEmail(text)}
                value={email} />
            <TextInput
                placeholder={"Hasło"}
                secureTextEntry
                onChangeText={text => setPassword(text)}
                value={password} />
            <Button title={"Zarejestruj się"} onPress={() => authentication(email, password)} />
        </>
    );
}

const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
            loading,
            loaded,
        },
        dispatch,
    ),
});

const SignUpScreenContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SignUpScreen);

export default SignUpScreenContainer;
