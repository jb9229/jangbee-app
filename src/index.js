import 'expo-asset';

import * as Font from 'expo-font';
import * as Sentry from 'sentry-expo';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';

import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { ApolloProvider } from '@apollo/client';
import AppNavigator from 'navigation/AppNavigator';
import JBActIndicator from 'molecules/JBActIndicator';
import LoginProvider from 'src/provider/LoginProvider';
import React from 'react';
import { ThemeProvider } from 'src/contexts/ThemeProvider';
import { apolloClient } from 'src/api/apollo';
import colors from 'constants/Colors';
import firebase from 'firebase';
import firebaseconfig from '../firebaseconfig';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

const SplashImage = styled.Image`
`;
const SplashWrap = styled.View`
  flex: 1;
  background-color: #4D4A4A;
`;

if (Platform.OS !== 'web' && !__DEV__)
{
  // Sentry.setRelease(Constants.manifest.revisionId);

  Sentry.init({
    dsn: 'https://f2c5a80b8fd24e6582e0221ea16e1ff2@o400382.ingest.sentry.io/5258774',
    enableInExpoDevelopment: false,
    debug: true
  });
}

export default class App extends React.Component
{
  state = {
    isLoadingComplete: false,
    isAppUpdateComplete: false
  };

  // componentDidMount ()
  // {
  //   this.checkUpdate();
  // }
  async componentDidMount ()
  {
    // Prevent native splash screen from autohiding
    try
    {
      await SplashScreen.preventAutoHideAsync();
    }
    catch (e)
    {
      console.warn(e);
    }
    this.prepareResources();
  }

  /**
   * Method that serves to load resources and make API calls
   */
  prepareResources = async () =>
  {
    // await performAPICalls();
    await this._loadResourcesAsync();
    this.setState({ ...this.state, isLoadingComplete: true }, async () =>
    {
      await SplashScreen.hideAsync();
    });

    await this.checkUpdate();
    this.initFirebase();
  };

  _loadResourcesAsync = async () =>
    Promise.all(loadAllAssests);

  // _handleLoadingError = error =>
  // {
  //   // In this case, you might want to report the error to your error
  //   // reporting service, for example Sentry
  //   console.warn(error);
  // };

  // _handleFinishLoading = () =>
  // {
  //   this.initFirebase();
  //   this.setState({ isLoadingComplete: true });
  // };

  checkUpdate = async () =>
  {
    try
    {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable)
      {
        console.log('=== update available:', update)
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        await Updates.reloadAsync();
        this.setState({ ...this.state, isAppUpdateComplete: true });
      }

      this.setState({ ...this.state, isAppUpdateComplete: true });
    }
    catch (e)
    {
      this.setState({ ...this.state, isAppUpdateComplete: true });
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
      return null;
    }

    if (!isAppUpdateComplete)
    {
      return <SplashWrap><JBActIndicator title="앱 버전 업데이트 체크중..." size={35} /></SplashWrap>;
    }

    return (
      <LoginProvider>
        <ThemeProvider>
          <ApolloProvider client={apolloClient}>
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
          </ApolloProvider>
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
    NanumBarunGothic: require('../assets/fonts/NanumBarunGothic.ttf'),
    NanumPen: require('../assets/fonts/NanumPen.ttf')
  })
];
