import React from 'react';
import {
  ActivityIndicator, StyleSheet, Text, View,
} from 'react-native';
import firebase from 'firebase';
import firebaseconfig from '../firebaseconfig';
import colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class AuthLoading extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    firebase.initializeApp(firebaseconfig);

    firebase.auth().languageCode = 'ko';

    firebase.auth().onAuthStateChanged((user) => {
      navigation.navigate(user ? 'Main' : 'Login');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login Checking...</Text>
        <ActivityIndicator size="large" color={colors.indicator} />
      </View>
    );
  }
}
