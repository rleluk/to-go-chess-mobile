import React from 'react';
import {StyleSheet, View} from 'react-native';
import TestGame from './components/testGame';

function App(): JSX.Element {
  return (
    <View style={styles.container}>
      <TestGame/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default App;
