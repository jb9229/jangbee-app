import React from 'react';
import {
  Alert, Button, ScrollView, StyleSheet, Text, TextInput,
} from 'react-native';
import { Linking, WebBrowser } from 'expo';
import firebase from 'firebase';
import fonts from '../constants/Fonts';
import colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalWrap: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
  },
  accoutTypeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  accountTypeTO: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    elevation: 10,
  },
  accountTypeText: {
    fontSize: 20,
  },
  selectedAccType: {
    backgroundColor: colors.point,
  },
  itemWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  commWrap: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    width: 300,
    fontFamily: fonts.titleMiddle,
    fontSize: 20,
  },
  loginTI: {
    width: 300,
    fontSize: 23,
    fontFamily: fonts.batang,
  },
  commText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: fonts.titleTop,
  },
  accTypePicker: {
    width: 265,
    height: 20,
  },
  accTypePickerItem: {},
});

const captchaUrl = `https://jangbee-inpe21.firebaseapp.com/captcha.html?appurl=${Linking.makeUrl(
  '',
)}`;

export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      confirmationResult: undefined,
      code: '',
    };
  }

  onPhoneChange = (phone) => {
    this.setState({ phone });
  };

  onCodeChange = (code) => {
    this.setState({ code });
  };

  onSignIn = async () => {
    const { navigation } = this.props;
    const { confirmationResult, code } = this.state;
    try {
      await confirmationResult.confirm(code).then((result) => {
        const user = result.user;
        console.log(user);
        navigation.navigate('Main');
      }).catch((error) => {
        Alert.alert(`로그인 요청에 문제가 있습니다, 재시도해 주세요: ${error}`);
        this.reset();
      });
    } catch (e) {
      console.warn(e);
      this.reset();
    }
  };

  onSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      console.warn(e);
    }
  };

  reset = () => {
    this.setState({
      phone: '',
      confirmationResult: undefined,
      code: '',
    });
  };

  onPhoneComplete = async () => {
    let token = null;
    const listener = ({ url }) => {
      WebBrowser.dismissBrowser();
      const tokenEncoded = Linking.parse(url).queryParams.token;
      if (tokenEncoded) token = decodeURIComponent(tokenEncoded);
    };
    Linking.addEventListener('url', listener);
    await WebBrowser.openBrowserAsync(captchaUrl);
    Linking.removeEventListener('url', listener);
    if (token) {
      const { phone } = this.state;
      // fake firebase.auth.ApplicationVerifier
      const captchaVerifier = {
        type: 'recaptcha',
        verify: () => Promise.resolve(token),
      };
      try {
        const confirmationResult = await firebase
          .auth()
          .signInWithPhoneNumber(phone, captchaVerifier);
        this.setState({ confirmationResult });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  login = () => {};

  register = () => {};

  render() {
    const { confirmationResult, phone, code } = this.state;

    if (!confirmationResult) {
      return (
        <ScrollView style={{ padding: 20, marginTop: 20 }}>
          <TextInput
            value={phone}
            onChangeText={this.onPhoneChange}
            keyboardType="phone-pad"
            placeholder="Your phone"
          />
          <Button onPress={this.onPhoneComplete} title="Next" />
        </ScrollView>
      );
    }
    return (
      <ScrollView style={{ padding: 20, marginTop: 20 }}>
        <TextInput
          value={code}
          onChangeText={this.onCodeChange}
          keyboardType="numeric"
          placeholder="Code from SMS"
        />
        <Button onPress={this.onSignIn} title="Sign in" />
      </ScrollView>
    );
  }
}
