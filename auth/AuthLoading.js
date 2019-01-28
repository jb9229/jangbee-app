import React from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import firebaseconfig from '../firebaseconfig';

export default class AuthLoading extends React.Component {
  componentDidMount() {
    firebase.initializeApp(firebaseconfig);

    firebase.auth().onAuthStateChanged((user) => {
      this.props.navigation.navigate(user ? 'Main' : 'Login');
    });
  }

  render() {
    return <View><Text>Loading</Text></View>;
  }
}
