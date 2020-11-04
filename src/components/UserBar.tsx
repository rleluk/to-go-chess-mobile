import React from 'react';
import {Button, Text} from "react-native";
import {bindActionCreators} from "redux";
import {restoreUser} from "../actions";
import {connect} from "react-redux";
import logout from "../utils/logout";


const UserBar = ({navigation, user}: any) => {
    return user ?
        <>
            <Text>{user.email}</Text>
            <Button onPress={logout} title={"Wyloguj się"} />
        </>
        :
        <>
            <Button onPress={() => navigation.navigate('Sign in')} title={"Zaloguj się"} />
        </>
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
});

const UserBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserBar);

export default UserBarContainer;
