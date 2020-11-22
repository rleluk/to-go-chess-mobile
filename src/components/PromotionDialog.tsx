import React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableHighlight } from 'react-native';
import { getComponentBySymbol } from '../helpers/get-component';


interface Props {
    color: 'black' | 'white';
    isVisible: boolean;
    modalCallback: (symbol: string) => void;
}


const generateItems = (color: 'white' | 'black', setIsVisible: (visible: boolean) => void, modalCallback: (symbol: string) => void) => {
    let symbols = color === 'black' ? ['q', 'r', 'b', 'n'] : ['Q', 'R', 'B', 'N'];
    let items: any[] = [];

    symbols.forEach(symbol => {
        items.push(
            <TouchableHighlight 
                key={`promotion=${symbol}`} 
                style={styles.square}  
                onPress={() => modalCallback(symbol.toUpperCase())}
            >
                { getComponentBySymbol(symbol) }
            </TouchableHighlight>
        );
    });

    return items;
};


export const PromotionDialog: FunctionComponent<Props> = (props: Props) => {
    const [isVisible, setIsVisible] = useState(false);
    const items = generateItems(props.color, setIsVisible, props.modalCallback);
    
    useEffect(() => {
        setIsVisible(props.isVisible);
    });

    return (
        <View>
            <Modal
                transparent={true}
                visible={isVisible}
                animationType="fade"
            >
                <View style={styles.outerView}>
                    <View style={{...styles.modal}}>
                        { items }
                    </View>
                </View>
            </Modal>
        </View>
    );
};  


const styles = StyleSheet.create({
    outerView: {
        backgroundColor: "#000000aa",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    square: {
        height: '80%',
        width: '25%',
    },
    modal: {
        backgroundColor: 'rgba(125, 116, 115, 0.85)', 
        borderRadius: 10, 
        flex: 0.15,
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2
    }
});
