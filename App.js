import React from 'react';
import {
  Platform, StatusBar, StyleSheet, View,
} from 'react-native';
import {
  AppLoading, Asset, Font, Icon,
} from 'expo';
import AppNavigator from './navigation/AppNavigator';
import LoginModal from './components/LoginModal';

const ACCOUNTTYPE_CLIENT = 1;
const ACCOUNTTYPE_FIRM = 2;
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    isLoginModalVisible: true,
    accountType: '',
    phoneNumber: '',
    password: '',
    isFirm: false,
  };

  setLoginModalVisible = (visible) => {
    this.setState({ isLoginModalVisible: visible });
  };

  render() {
    const {
      isLoadingComplete,
      isLoginModalVisible,
      phoneNumber,
      password,
      accountType,
      isFirm,
    } = this.state;

    const { skipLoadingScreen } = this.props;

    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    if (isLoginModalVisible) {
      return (
        <LoginModal
          isVisible={isLoginModalVisible}
          setLoginModalVisible={this.setLoginModalVisible}
          isFirm={isFirm}
          phoneNumber={phoneNumber}
          password={password}
          onChnagePN={text => this.setState({ phoneNumber: text })}
          onChnagePW={text => this.setState({ password: text })}
          onChangeAT={(isFirm) => this.setState({ isFirm })}
        />
      );
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator accountType={ACCOUNTTYPE_FIRM} />
      </View>
    );
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
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'yang-rounded': require('./assets/fonts/Yang-roundgothic.ttf'),
      'Hamchorong-batang': require('./assets/fonts/Hamchorong-batang.ttf'),
      'Hoon-saemaulundong': require('./assets/fonts/HoonSaemaulundongR.ttf'),
    }),
  ]);

  _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
