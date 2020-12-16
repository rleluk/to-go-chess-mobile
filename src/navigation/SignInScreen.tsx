import React, {useState} from 'react';
import {TouchableOpacity, TextInput, ImageBackground, Text, StyleSheet, View} from "react-native";
import auth from "@react-native-firebase/auth";
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import {bindActionCreators} from "redux";
import {loading, loaded} from "../actions";
import {connect, Provider} from "react-redux";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';

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

    async function onFacebookTouchableOpacityPress() {
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

    async function onGoogleTouchableOpacityPress() {
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
            <View style={{marginVertical: 30}}>
                <TextInput
                    placeholder={"E-mail"}
                    onChangeText={text => setEmail(text)}
                    value={email} 
                    style={{...styles.input, ...styles.shadowBox}}
                />
                <TextInput
                    placeholder={"Hasło"}
                    secureTextEntry
                    onChangeText={text => setPassword(text)}
                    value={password} 
                    style={{...styles.input, ...styles.shadowBox}}
                />
            </View>

            <TouchableOpacity 
                onPress={() => authentication(email, password)}
                style={{...styles.button, ...styles.shadowBox}}
            >
                <IonIcon 
                    name='enter-outline'
                    color='#707070' 
                    size={30} 
                />
                <Text style={styles.buttonText}>
                    Zaloguj się
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onFacebookTouchableOpacityPress().then(() => {
                    console.log('Signed in with Facebook!');
                    loaded('Login');
                }).catch(error => {
                    console.log(error.message);
                    loaded('Login');
                })}
                style={{...styles.button, ...styles.shadowBox}}
            >
                <AntDesignIcon
                    name='facebook-square'
                    color='#707070'
                    size={30}
                />
                <Text style={styles.buttonText}>
                    Zaloguj się przez Facebook'a
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onGoogleTouchableOpacityPress().then(() => {
                    console.log('Signed in with Google!');
                    loaded('Login');
                }).catch(error => {
                    console.log(error.message);
                    loaded('Login');
                })}
                style={{...styles.button, ...styles.shadowBox}}
            >
                <AntDesignIcon
                    name='google'
                    color='#707070'
                    size={30}
                />
                <Text style={styles.buttonText}>
                    Zaloguj się przez Google
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => navigation.navigate('Sign up')}
                style={{...styles.button, ...styles.shadowBox}}
            >
                <AntDesignIcon
                    name='user'
                    color='#707070'
                    size={30}
                />
                <Text style={styles.buttonText}>
                    Zarejestruj się
                </Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    input: {
        marginTop: 20, 
        paddingHorizontal: 20, 
        paddingVertical: 10,
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 50,
        backgroundColor: "#f0f0f0",
        marginHorizontal: 10,
    },
    button: {
        marginTop: 20, 
        marginHorizontal: 20,
        paddingHorizontal: 20, 
        paddingVertical: 10,
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: "#ecead1"
    },
    shadowBox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        marginLeft: 50,
    }
});

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
