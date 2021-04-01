import 'expo-asset';

import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';

import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';

import AlarmSettingModal from './components/templates/AlarmSettingModal';
import { ApolloProvider } from '@apollo/client';
import AppNavigator from 'navigation/AppNavigator';
import JBActIndicator from 'molecules/JBActIndicator';
import LoginProvider from 'src/provider/LoginProvider';
import Sentry from 'utils/sentry';
import { ThemeProvider } from 'src/contexts/ThemeProvider';
import { alarmSettingModalStat } from './container/firmHarmCase/store';
import { apolloClient } from 'src/api/apollo';
import colors from 'constants/Colors';
import firebase from 'firebase';
import firebaseconfig from '../firebaseconfig';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const SplashWrap = styled.View`
  flex: 1;
  background-color: #4d4a4a;
`;

if (Platform.OS !== 'web' && !__DEV__) {
  // Sentry.setRelease(Constants.manifest.revisionId);

  Sentry.init({
    dsn:
      'https://f2c5a80b8fd24e6582e0221ea16e1ff2@o400382.ingest.sentry.io/5258774',
    enableInExpoDevelopment: false,
    debug: true,
  });
}

interface Props {
  skipLoadingScreen: boolean;
  BLACKLIST_LAUNCH: boolean;
}

const App: React.FC<Props> = ({ skipLoadingScreen, BLACKLIST_LAUNCH }) => {
  // states
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isAppUpdateComplete, setAppUpdateComplete] = useState(false);

  // component life cycle
  useEffect(() => {
    // Prevent native splash screen from autohiding
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    })();

    prepareResources();
  }, []);

  useEffect(() => {
    (async () => {
      if (isLoadingComplete == true) {
        await SplashScreen.hideAsync();
      }
    })();
  }, [isLoadingComplete]);

  /**
   * Method that serves to load resources and make API calls
   */
  const prepareResources = async () => {
    // await performAPICalls();
    await _loadResourcesAsync();
    setLoadingComplete(true);

    await checkUpdate();
    initFirebase();
  };

  const _loadResourcesAsync = async () => Promise.all(loadAllAssests);

  const checkUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        console.log('=== update available:', update);
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        await Updates.reloadAsync();
        setAppUpdateComplete(true);
      }

      setAppUpdateComplete(true);
    } catch (e) {
      setAppUpdateComplete(true);
    }
  };

  const initFirebase = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseconfig);
      firebase.auth().languageCode = 'ko';
    }
  };

  if (!isLoadingComplete && !skipLoadingScreen) {
    return null;
  }

  if (!isAppUpdateComplete) {
    return (
      <SplashWrap>
        <JBActIndicator title="앱 버전 업데이트 체크중..." size={35} />
      </SplashWrap>
    );
  }

  return (
    <RecoilRoot>
      <LoginProvider>
        <ThemeProvider>
          <ApolloProvider client={apolloClient}>
            <React.Suspense fallback={<ActivityIndicator />}>
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
                <AlarmSettingModal />
              </View>
            </React.Suspense>
          </ApolloProvider>
        </ThemeProvider>
      </LoginProvider>
    </RecoilRoot>
  );
};

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
    NanumPen: require('../assets/fonts/NanumPen.ttf'),
  }),
];

export default App;
