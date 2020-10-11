import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

function App(): JSX.Element {
  return (
    <View style={styles.container}>
      <View >
        <Text> Hello, world! </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default App;
