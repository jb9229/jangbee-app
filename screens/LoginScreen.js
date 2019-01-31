import React from 'react';
import {
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Text,
  View,
} from 'react-native';
import { Linking, WebBrowser } from 'expo';
import firebase from 'firebase';
import fonts from '../constants/Fonts';
import { validate } from '../utils/Validation';
import FirmCreaErrMSG from '../components/FirmCreaErrMSG';
import { withLogin } from '../contexts/LoginProvider';
import JBButton from '../components/molecules/JBButton';

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
  itemWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  commWrap: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  title: {
    width: 300,
    fontFamily: fonts.titleMiddle,
    fontSize: 20,
  },
  titleDisable: {
    width: 300,
    fontFamily: fonts.titleMiddle,
    fontSize: 20,
    color: 'gray',
  },
  loginTI: {
    width: 300,
    fontSize: 21,
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

class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      confirmationResult: undefined,
      code: '',
      phoneNumberValErrMessage: '',
      codeValErrMessage: '',
    };
  }

  onPhoneChange = (phoneNumber) => {
    this.setState({ phoneNumber });
  };

  onCodeChange = (code) => {
    this.setState({ code });
  };

  onSignIn = () => {
    const { setUser } = this.props;
    const { confirmationResult, code } = this.state;

    // Validation
    const v = validate('decimal', code, true);
    if (!v[0]) {
      this.setState({ codeValErrMessage: v[1] });
      return;
    }

    confirmationResult
      .confirm(code)
      .then((result) => {
        const { user } = result;

        setUser(user);
        this.checkUserType(user.uid);
      })
      .catch((error) => {
        Alert.alert(`잘못된 인증 코드입니다: ${error}`);
      });
  };

  checkUserType = (uid) => {
    const { navigation, setUserType } = this.props;

    firebase
      .database()
      .ref(`users/${uid}/userType`)
      .once('value', (data) => {
        if (data === null) {
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

  onSignOut = () => {
    try {
      firebase.auth().signOut();
    } catch (e) {
      Alert.alert(`로그아웃 요청에 문제가 있습니다, 재시도해 주세요${e}`);
    }
  };

  reset = () => {
    this.setState({
      phoneNumber: '',
      confirmationResult: undefined,
      code: '',
    });
  };

  convertNationalPN = (phoneNumber) => {
    const koreaNationalPhoneNumber = '+82';

    if (phoneNumber === '') {
      return undefined;
    }
    const newPN = phoneNumber.substring(1); // Remove 010 -> 10

    return `${koreaNationalPhoneNumber}${newPN}`;
  };

  /**
   * Validation 에러 메세지 초기화
   */
  resetValErrMsg = () => {
    this.setState({ phoneNumberValErrMessage: '', codeValErrMessage: '' });
  };

  onPhoneComplete = async () => {
    this.resetValErrMsg();

    const { phoneNumber } = this.state;

    // Validation
    const v = validate('cellPhone', phoneNumber, true);
    if (!v[0]) {
      this.setState({ phoneNumberValErrMessage: v[1] });
      return;
    }

    // Check Captcha
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
      const nationalPNumber = this.convertNationalPN(phoneNumber);

      // fake firebase.auth.ApplicationVerifier
      const captchaVerifier = {
        type: 'recaptcha',
        verify: () => Promise.resolve(token),
      };
      try {
        const confirmationResult = await firebase
          .auth()
          .signInWithPhoneNumber(nationalPNumber, captchaVerifier);
        this.setState({ confirmationResult });
      } catch (e) {
        Alert.alert('핸드폰 인증에 요청에 문제가 있습니다, 재시도해 주세요');
      }
    }
  };

  render() {
    const {
      confirmationResult,
      phoneNumber,
      code,
      phoneNumberValErrMessage,
      codeValErrMessage,
    } = this.state;
    let authTitleStyle = styles.title;
    let authReadOnly = true;
    if (!confirmationResult) {
      authTitleStyle = styles.titleDisable;
      authReadOnly = false;
    }

    return (
      <View style={styles.container}>
        <View style={styles.itemWrap}>
          <Text style={styles.title}>핸드폰번호: </Text>
          <TextInput
            style={styles.loginTI}
            value={phoneNumber}
            keyboardType="phone-pad"
            onChangeText={(text) => {
              this.onPhoneChange(text);
            }}
            placeholder="휴대전화 번호입력(숫자만)"
          />
          <FirmCreaErrMSG errorMSG={phoneNumberValErrMessage} />
          <Text style={authTitleStyle}>인증코드: </Text>
          <TextInput
            style={styles.loginTI}
            value={code}
            onChangeText={(text) => {
              this.onCodeChange(text);
            }}
            keyboardType="numeric"
            secureTextEntry
            placeholder="SMS로 받은 인증코드 숫자입력"
            editable={authReadOnly}
          />
          <FirmCreaErrMSG errorMSG={codeValErrMessage} />
        </View>

        <View style={styles.commWrap}>
          {!confirmationResult ? (
            <JBButton title="휴대전화 번호인증" onPress={() => this.onPhoneComplete()} />
          ) : (
            <JBButton title="로그인" onPress={() => this.onSignIn()} />
          )}
        </View>
      </View>
    );
  }
}

export default withLogin(LoginScreen);
