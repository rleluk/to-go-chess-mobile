import React, {useState} from 'react';
import {Text, Button, StyleSheet, View, TextInput, ImageBackground} from "react-native";
import auth from '@react-native-firebase/auth';
import {bindActionCreators} from "redux";
import {loaded, loading} from "../actions";
import {connect} from "react-redux";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';


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

const SignUpScreenContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SignUpScreen);

export default SignUpScreenContainer;
