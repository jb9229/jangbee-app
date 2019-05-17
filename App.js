import React from 'react';
import {
  Platform, StatusBar, StyleSheet, View,
} from 'react-native';
import {
  AppLoading, Asset, Font, Icon, Notifications,
} from 'expo';
import firebase from 'firebase';
import AppNavigator from './navigation/AppNavigator';
import { LoginProvider } from './contexts/LoginProvider';
import colors from './constants/Colors';
import firebaseconfig from './firebaseconfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  // componentDidMount() {
  //   this._notificationSubscription = Notifications.addListener(this.notifi);
  // }

  notifi = (notifi) => {
    console.log(notifi);
  };

  _loadResourcesAsync = async () => Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Icon.Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free
      // to remove this if you are not using it in your app
      SsangmundongGulimB: require('./assets/fonts/Typo_SsangmundongGulimB.ttf'),
      NanumSquareRoundR: require('./assets/fonts/NanumSquareRoundR.ttf'),
      NanumGothic: require('./assets/fonts/NanumGothic.ttf'),
      NanumPen: require('./assets/fonts/NanumPen.ttf'),
    }),
  ]);

  _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.initFirebase();
    this.setState({ isLoadingComplete: true });
  };

  initFirebase = () => {
    firebase.initializeApp(firebaseconfig);

    firebase.auth().languageCode = 'ko';
  };

  render() {
    const { skipLoadingScreen } = this.props;
    const { isLoadingComplete } = this.state;

    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    return (
      <LoginProvider>
        <View style={styles.container}>
          {Platform.OS === 'ios' ? (
            <StatusBar barStyle="default" />
          ) : (
            <StatusBar backgroundColor={colors.batangDark} currentHeight={32} barStyle="default" />
          )}
          <AppNavigator />
        </View>
      </LoginProvider>
    );
  }
}
