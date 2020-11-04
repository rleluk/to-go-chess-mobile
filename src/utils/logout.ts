import firebase from '@react-native-firebase/app';
//import {GoogleSignin} from '@react-native-community/google-signin';

export default async function logout() {
    try {
        await firebase.auth().signOut();
    } catch (e) {
        console.log(e);
    }
    // try {
    //     await GoogleSignin.signOut();
    //     await GoogleSignin.revokeAccess();
    // } catch (error) {
    //     console.log(error);
    // }
}
