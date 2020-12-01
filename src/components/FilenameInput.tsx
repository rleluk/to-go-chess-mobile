import React, {useState} from 'react';
import {TouchableOpacity, TextInput, View, Text} from "react-native";

interface Props {
    style?: any;
    buttonText: string;
    onPress: (text: string) => void;
}

const FilenameInput = (props: Props) => {
    const [text, setText] = useState('');
    
    return (
        <View style={props.style}>
            <TextInput 
                style={{backgroundColor: '#60606022', margin: 7}}
                placeholder={"Nazwa pliku"}
                onChangeText={text => setText(text)}
                value={text} />
            <TouchableOpacity onPress={() => props.onPress(text)}> 
                <Text style={{alignSelf: 'center', color: 'brown', fontWeight: 'bold', margin: 3}}>
                    {props.buttonText}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default FilenameInput;
