import * as Font from 'expo-font';
import * as Updates from 'expo-updates';

import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { AppLoading } from 'expo';
import AppNavigator from 'navigation/AppNavigator';
import JBActIndicator from 'molecules/JBActIndicator';
import { LoginProvider } from 'src/contexts/LoginContext';
import React from 'react';
import { ThemeProvider } from 'src/contexts/ThemeProvider';
import colors from 'constants/Colors';
import firebase from 'firebase';
import firebaseconfig from '../firebaseconfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default class App extends React.Component
{
  state = {
    isLoadingComplete: false,
    isAppUpdateComplete: false
  };

  componentDidMount ()
  {
    this.checkUpdate();
  }

  _loadResourcesAsync = async () =>
    Promise.all(loadAllAssests);

  _handleLoadingError = error =>
  {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () =>
  {
    this.initFirebase();
    this.setState({ isLoadingComplete: true });
  };

  checkUpdate = async () =>
  {
    try
    {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable)
      {
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        Updates.reloadFromCache();
        this.setState({ isAppUpdateComplete: true });
      }

      this.setState({ isAppUpdateComplete: true });
    }
    catch (e)
    {
      this.setState({ isAppUpdateComplete: true });
    }
  };

  initFirebase = () =>
  {
    if (!firebase.apps.length)
    {
      firebase.initializeApp(firebaseconfig);
      firebase.auth().languageCode = 'ko';
    }
  };

  render ()
  {
    const { skipLoadingScreen, BLACKLIST_LAUNCH } = this.props;
    const { isLoadingComplete, isAppUpdateComplete } = this.state;

    if (!isLoadingComplete && !skipLoadingScreen)
    {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    if (!isAppUpdateComplete)
    {
      return <JBActIndicator title="앱 버전 업데이트 체크중..." size={35} />;
    }

    return (
      <LoginProvider>
        <ThemeProvider>
          <View style={styles.container}>
            {Platform.OS === 'ios' ? (
              <StatusBar barStyle="default" />
            ) : (
              <StatusBar
                backgroundColor={colors.batangDark}
                currentHeight={32}
                barStyle="default"
              />
            )}
            <AppNavigator blListNumber={BLACKLIST_LAUNCH} />
          </View>
        </ThemeProvider>
      </LoginProvider>
    );
  }
}

export const loadAllAssests = [
  // Asset.loadAsync([
  //   require('../assets/images/robot-dev.png'),
  //   require('../assets/images/robot-prod.png')
  // ]),
  Font.loadAsync({
    // This is the font that we are using for our tab bar
    // ...Icon.Ionicons.font,
    // We include SpaceMono because we use it in HomeScreen.js. Feel free
    // to remove this if you are not using it in your app
    SsangmundongGulimB: require('../assets/fonts/Typo_SsangmundongGulimB.ttf'),
    NanumSquareRoundR: require('../assets/fonts/NanumSquareRoundR.ttf'),
    NanumGothic: require('../assets/fonts/NanumGothic.ttf'),
    NanumPen: require('../assets/fonts/NanumPen.ttf')
  })
];
