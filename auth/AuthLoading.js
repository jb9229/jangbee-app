import React from 'react';
import {
  Alert, ActivityIndicator, StyleSheet, Text, View,
} from 'react-native';
import firebase from 'firebase';
import firebaseconfig from '../firebaseconfig';
import colors from '../constants/Colors';
import { withLogin } from '../contexts/LoginProvider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class AuthLoading extends React.Component {
  componentDidMount() {
    this.initFirebase();
    this.checkLogin();
  }

  initFirebase = () => {
    firebase.initializeApp(firebaseconfig);

    firebase.auth().languageCode = 'ko';
  };

  checkLogin = () => {
    const { navigation, setUser } = this.props;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        this.checkUserType(user.uid);
      } else {
        navigation.navigate('Login');
      }
    });
  };

  checkUserType = (uid) => {
    const { navigation, setUserType } = this.props;

    firebase
      .database()
      .ref(`users/${uid}/userType`)
      .once('value', (data) => {
        if (data.val() === null) {
          navigation.navigate('SignUp');
          return;
        }

        const userType = data.val();

        setUserType(userType);
        if (userType === 1) {
          navigation.navigate('ClientMain');
        } else if (userType === 2) {
          navigation.navigate('FirmMain');
        } else {
          Alert.alert('유효하지 않은 사용자 입니다.');
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Login Checking...</Text>
        <ActivityIndicator size="large" color={colors.indicator} />
      </View>
    );
  }
}

export default withLogin(AuthLoading);
