import React from 'react';
import {FunctionComponent} from 'react';
import {ImageBackground, View, ScrollView, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {gameTreeUpdated} from '../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { black } from 'react-native-paper/lib/typescript/src/styles/colors';

interface Props {game, gameTree, style, gameTreeUpdated, isTreeEnabled}

const generateItems = (game, gameTree: any, gameTreeUpdated: any, isTreeEnabled: boolean) => {
    let items: any[] = [];
    
    const onClick = (node) => {
        game.getTree().setLeaf(node);
        game.update(node.positionFEN);
        gameTreeUpdated(game.getTree().toSerializable());
    }

    const traverse = (node: any, result: any[] = [], isMain = true) => {
        if (Array.isArray(node)) {
            let branchResult = [];
            const isOnRightSide = node[0].positionFEN.split(' ')[1] === 'w';
            if (isOnRightSide) {
                branchResult.push(
                    [
                        <Text key={"turn"+node[0].positionFEN + Math.random()} style={styles.SubTurnNumber}>
                            {node[0].positionFEN.split(' ').slice(-1) - 1}..
                         </Text>,
                        <Text key={node[0].positionFEN + Math.random()} style={styles.SubTreeNode}>
                            ...
                        </Text>
                    ]
                );
            }
            for (const child of node) {
                traverse(child, branchResult, false);
            }
            if (isOnRightSide) {
                result.push(
                    <Text key={node[0].positionFEN + Math.random()} style={isMain ? styles.TreeNode: styles.SubTreeNode}>
                        ...
                    </Text>
                );
            }
            result.push(
                <View key={"internal"+node[0].positionFEN + Math.random()} style={styles.SubTree}>
                    {branchResult}
                </View>
            );
            if (isOnRightSide) {
                result.push(
                    [
                        <Text key={"turn"+node[0].positionFEN + Math.random()} style={isMain ? styles.TurnNumber : styles.SubTurnNumber}>
                            {node[0].positionFEN.split(' ').slice(-1) - 1}
                        </Text>,
                        <Text key={node[0].positionFEN} style={isMain ? styles.TreeNode : styles.SubTreeNode}>
                            ...
                        </Text>
                    ]
                );
            }
        } else {
            if (node.positionFEN.split(' ')[1] === 'b') {
                result.push(
                    <Text key={"turn"+node.positionFEN + Math.random()} style={isMain ? styles.TurnNumber : styles.SubTurnNumber}>
                        {node.positionFEN.split(' ').slice(-1)}
                    </Text>
                );
            }
            let isLeaf = node === game.getTree().leaf;
            let style = isMain ? (isLeaf ? styles.Leaf : styles.TreeNode) : (isLeaf ? styles.SubLeaf : styles.SubTreeNode);
            result.push(
                <TouchableOpacity key={node.positionFEN + Math.random()} style={style} onPress={isTreeEnabled ? () => onClick(node) : undefined}>
                    <Text style={{textAlign: 'center'}}>
                        {node.move}
                    </Text>
                </TouchableOpacity>
            );
        }
    }

    for (const child of gameTree) {
        traverse(child, items);
    }

    return items;
}

export const GameTree: FunctionComponent<Props> = (props: Props) => {
    const {gameTree, game, gameTreeUpdated, isTreeEnabled} = props;

    if (gameTree !== undefined && game !== undefined) {
        var items = generateItems(game, gameTree, gameTreeUpdated, isTreeEnabled);
    }

    return (
        <ImageBackground resizeMode='stretch' source={require('../images/texture_of_burnt_wood.png')} style={{...props.style}}>
            <ScrollView contentContainerStyle={styles.GameTree}>
                {items}
            </ScrollView>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    GameTree: {
        borderRadius: 6,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
    },
    TreeNode: {
        textAlign: 'center',
        fontSize: 15,
        padding: 4,
        height: 27,
        width: '44%',
        borderRightColor: '#666666',
        borderRightWidth: 1,
        color: '#404040',
    },
    TurnNumber: {
        fontSize: 14,
        padding: 4,
        height: 27,
        width: '12%',
        textAlign: 'center',
        borderRightColor: '#666666',
        borderRightWidth: 1,
        color: '#505050',
    },
    Leaf: {
        fontSize: 18,
        padding: 4,
        height: 27,
        width: '44%',
        textAlign: 'center',
        borderRightColor: '#666666',
        borderRightWidth: 1,
        color: '#784444',
        backgroundColor: '#77555544',
    },
    SubTree: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        backgroundColor: '#69696933',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    SubTurnNumber: {
        fontSize: 14,
        padding: 4,
        height: 27,
        width: '9%',
        textAlign: 'center',
        borderRightColor: '#666666',
        borderRightWidth: 1,
        color: '#505050',
    },
    SubTreeNode: {
        textAlign: 'center',
        fontSize: 15,
        padding: 4,
        height: 27,
        width: '45.5%',
        borderRightColor: '#666666',
        borderRightWidth: 1,
        color: '#404040',
    },
    SubLeaf: {
        fontSize: 18,
        padding: 4,
        height: 27,
        width: '45.5%',
        textAlign: 'center',
        borderRightColor: '#666666',
        borderRightWidth: 1,
        color: '#784444',
        backgroundColor: '#77555544',
    },
});

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
            gameTreeUpdated
        },
        dispatch,
    ),
});

const mapStateToProps = (state: any) => {
    const {game, gameTree, isTreeEnabled} = state.app;
    return {
        game, 
        gameTree,
        isTreeEnabled
    };
};

const WrappedGameTree = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GameTree);


export default WrappedGameTree;