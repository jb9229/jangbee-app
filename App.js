import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';

import { AppLoading, Updates } from 'expo';
import {
  Platform, StatusBar, StyleSheet, View,
} from 'react-native';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import React from 'react';
import firebase from 'firebase';

import { LoginProvider } from './contexts/LoginProvider';
import AppNavigator from './navigation/AppNavigator';
import JBActIndicator from './components/organisms/JBActIndicator';
import colors from './constants/Colors';
import firebaseconfig from './firebaseconfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

class App extends React.Component {
  state = {
    isLoadingComplete: false,
    isAppUpdateComplete: false,
  };

  componentDidMount() {
    this.checkUpdate();
  }

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

  checkUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        Updates.reloadFromCache();
        this.setState({ isAppUpdateComplete: true });
      }

      this.setState({ isAppUpdateComplete: true });
    } catch (e) {
      this.setState({ isAppUpdateComplete: true });
    }
  };

  initFirebase = () => {
    firebase.initializeApp(firebaseconfig);

    firebase.auth().languageCode = 'ko';
  };

  render() {
    const { skipLoadingScreen } = this.props;
    const { isLoadingComplete, isAppUpdateComplete } = this.state;

    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    if (!isAppUpdateComplete) {
      return <JBActIndicator title="앱 버전 업데이트 체크중..." size={35} />;
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

export default (Constants.manifest.slug === 'jangbeecall_native_storybook'
  ? require('./storybook').default
  : App);
