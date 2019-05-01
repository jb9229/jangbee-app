import React from 'react';
import {
  Alert, StyleSheet, TextInput, Text, View,
} from 'react-native';
import { Linking, WebBrowser } from 'expo';
import firebase from 'firebase';
import fonts from '../constants/Fonts';
import { getUserInfo } from '../utils/FirebaseUtils';
import { validate } from '../utils/Validation';
import JBErrorMessage from '../components/organisms/JBErrorMessage';
import { withLogin } from '../contexts/LoginProvider';
import JBButton from '../components/molecules/JBButton';
import { notifyError } from '../common/ErrorNotice';
import registerForPushNotificationsAsync from '../common/registerForPushNotificationsAsync';

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
    fontSize: 22,
    marginTop: 20,
  },
  titleDisable: {
    width: 300,
    fontFamily: fonts.titleMiddle,
    fontSize: 22,
    color: 'gray',
    marginTop: 20,
  },
  loginTI: {
    width: 300,
    fontSize: 24,
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

  onSignIn = async () => {
    const { navigation } = this.props;
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

        registerForPushNotificationsAsync(user.uid);
        getUserInfo(user.uid)
          .then((data) => {
            const userInfo = data.val();
            const { userType } = userInfo;

            if (!userType) {
              navigation.navigate('SignUp', { user });
            } else {
              navigation.navigate('AuthLoading');
            }
          })
          .catch(error => notifyError(
            'FB 사용자 정보 요청 실패',
            `사용자 정보 요청에 문제가 있습니다, 다시 시도해 주세요(${error.message})`,
          ));
      })
      .catch((error) => {
        Alert.alert(`잘못된 인증 코드입니다: ${error}`);
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
            editable={!authReadOnly}
          />
          <JBErrorMessage errorMSG={phoneNumberValErrMessage} />
          <Text style={authTitleStyle}>인증코드: </Text>
          <TextInput
            style={styles.loginTI}
            value={code}
            onChangeText={(text) => {
              this.onCodeChange(text);
            }}
            keyboardType="numeric"
            secureTextEntry
            placeholder="SMS 인증코드 입력"
            editable={authReadOnly}
            onSubmitEditing={() => this.onSignIn()}
          />
          <JBErrorMessage errorMSG={codeValErrMessage} />
        </View>

        <View style={styles.commWrap}>
          {!confirmationResult ? (
            <JBButton title="전화번호 인증하기" onPress={() => this.onPhoneComplete()} />
          ) : (
            <JBButton title="로그인하기" onPress={() => this.onSignIn()} Primary />
          )}
        </View>
      </View>
    );
  }
}

export default withLogin(LoginScreen);
