import React, {useState} from 'react';
import {Button, TextInput, ImageBackground} from "react-native";
import auth from "@react-native-firebase/auth";
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import {bindActionCreators} from "redux";
import {loading, loaded} from "../actions";
import {connect, Provider} from "react-redux";


const SignInScreen = ({navigation, loading, loaded}: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const authentication = (email: string, password: string) => {
        if(!email || !password) return;

        loading('Login');
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User signed in!');
            })
            .catch(error => {
                console.log(error.message);
            })
            .finally(() => {
                loaded('Login');
            });
    }

    async function onFacebookButtonPress() {
        loading('Login');
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }

        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        return auth().signInWithCredential(facebookCredential);
    }

    async function onGoogleButtonPress() {
        loading('Login');
        GoogleSignin.configure({
            offlineAccess: false,
            webClientId: '100252322773-tnpp8tpktgrn0lt6p78igljhffcqgp1s.apps.googleusercontent.com',
            androidClientId: '100252322773-nu25art5lbq3ntje422simn0fpnfhhv0.apps.googleusercontent.com',
        } as any)

        const {idToken} = await GoogleSignin.signIn();

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        return auth().signInWithCredential(googleCredential);
    }

    return (
        <ImageBackground source={require('../images/togochessbackground.jpg')} style={{width: '100%', height: '100%'}}>
            <TextInput
                placeholder={"E-mail"}
                onChangeText={text => setEmail(text)}
                value={email} />
            <TextInput
                placeholder={"Hasło"}
                secureTextEntry
                onChangeText={text => setPassword(text)}
                value={password} />
            <Button title={"Zaloguj się"} onPress={() => authentication(email, password)} />
            <Button
                title="Facebook Sign-In"
                onPress={() => onFacebookButtonPress().then(() => {
                    console.log('Signed in with Facebook!');
                    loaded('Login');
                }).catch(error => {
                    console.log(error.message);
                    loaded('Login');
                })}
            />
            <Button
                title="Google Sign-In"
                onPress={() => onGoogleButtonPress().then(() => {
                    console.log('Signed in with Google!');
                    loaded('Login');
                }).catch(error => {
                    console.log(error.message);
                    loaded('Login');
                })}
            />
            <Button onPress={() => navigation.navigate('Sign up')} title={"Zarejestruj się"} />
        </ImageBackground>
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

const SignInScreenContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SignInScreen);

export default SignInScreenContainer;
