import React from 'react';
<<<<<<< HEAD
import { Alert, StyleSheet, View } from 'react-native';
import { Linking } from 'expo';
import * as WebBrowser from 'expo-web-browser';
=======
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import { Linking, WebBrowser } from 'expo';
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
import styled from 'styled-components';
import firebase from 'firebase';
import fonts from '../constants/Fonts';
import colors from '../constants/Colors';
import { getUserInfo } from '../utils/FirebaseUtils';
import { validate } from '../utils/Validation';
import { formatTelnumber } from '../utils/StringUtils';
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
  titleDisable: {
    width: 300,
    fontFamily: fonts.titleMiddle,
    fontSize: 22,
    color: 'gray',
    marginTop: 20,
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

const CommWrap = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const TextInput = styled.TextInput`
  font-family: ${fonts.batang};
  width: 300;
  font-size: 24;
`;

const Title = styled.Text`
  width: 300;
  font-family: ${fonts.titleMiddle};
  font-size: 22;
  margin-top: 20;
  ${props => props.fill
    && `
    color: ${colors.point2};
  `}
`;

<<<<<<< HEAD
const ErrorMsg = styled.Text`
  color: red;
`;

const LogMsg = styled.Text`
  color: blue;
`;

const captchaUrl = `https://jangbee-inpe21.firebaseapp.com/captcha_v3.html?appurl=${Linking.makeUrl()}`;
=======
const captchaUrl = `https://jangbee-inpe21.firebaseapp.com/captcha.html?appurl=${Linking.makeUrl(
  '/?',
)}`;
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b

class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      confirmationResult: undefined,
      code: '',
<<<<<<< HEAD
      capchaListener: undefined,
=======
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
      phoneNumberValErrMessage: '',
      codeValErrMessage: '',
    };
  }

<<<<<<< HEAD
  componentDidMount() {
    const capchaListener = ({ url }) => {
      let token;
      const tokenEncoded = Linking.parse(url).queryParams.token;
      if (tokenEncoded) token = decodeURIComponent(tokenEncoded);
      this.setCaptchaListener(token);
    };

    this.setState({ capchaListener });
    Linking.addEventListener('url', capchaListener);
  }

  componentWillUnmount() {
    const { capchaListener } = this.state;

    Linking.removeEventListener('url', capchaListener);
  }

=======
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
  onPhoneChange = (phoneNumber) => {
    this.setState({ phoneNumber });
  };

  onCodeChange = (code) => {
    this.setState({ code });
  };

  onSignIn = async () => {
    const { changeAuthPath } = this.props;
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
<<<<<<< HEAD
            if (!userInfo) {
              changeAuthPath(2, user);
              return;
            }
=======
            if (!userInfo) { changeAuthPath(2, user); return; }
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b

            const { userType } = userInfo;

            if (!userType) {
              changeAuthPath(2, user);
            } else {
              changeAuthPath(1);
            }
          })
          .catch(error => notifyError(
            'FB 사용자 정보 요청 실패',
            `사용자 정보 요청에 문제가 있습니다, 다시 시도해 주세요(${error.message})`,
          ));
      })
      .catch((error) => {
<<<<<<< HEAD
        Alert.alert('잘못된 인증 코드입니다', error.message);
=======
        Alert.alert(`잘못된 인증 코드입니다: ${error}`);
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
      });
  };

  onSignOut = () => {
    try {
      firebase.auth().signOut();
    } catch (e) {
      Alert.alert(`로그아웃 요청에 문제가 있습니다, 재시도해 주세요${e}`);
    }
  };

  cancelSignIn = () => {
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
    let newPN = phoneNumber.replace(/-/g, ''); // without hyphen

    newPN = newPN.substring(1); // Remove 010 -> 10

    return `${koreaNationalPhoneNumber}${newPN}`;
  };

  /**
   * Validation 에러 메세지 초기화
   */
  resetValErrMsg = () => {
<<<<<<< HEAD
    this.setState({ phoneNumberValErrMessage: '', codeValErrMessage: '', logMsg: '', errorMsg: '' });
=======
    this.setState({ phoneNumberValErrMessage: '', codeValErrMessage: '' });
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
  };

  onPhoneComplete = async () => {
    this.resetValErrMsg();

<<<<<<< HEAD
    // Check Captcha
    WebBrowser.openBrowserAsync(captchaUrl);
  };

  setCaptchaListener = async (token) => {
=======
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
    const { phoneNumber } = this.state;

    const pnWithoutHyphen = phoneNumber.replace(/-/g, '');

    // Validation
    const v = validate('cellPhone', pnWithoutHyphen, true);
    if (!v[0]) {
      this.setState({ phoneNumberValErrMessage: v[1] });
      return;
    }

<<<<<<< HEAD
=======
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
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
    if (token) {
      const nationalPNumber = this.convertNationalPN(pnWithoutHyphen);

      // fake firebase.auth.ApplicationVerifier
      const captchaVerifier = {
        type: 'recaptcha',
        verify: () => Promise.resolve(token),
      };
<<<<<<< HEAD
      this.setState({ logMsg: `Listener Token: ${token}` });
=======

>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
      try {
        const confirmationResult = await firebase
          .auth()
          .signInWithPhoneNumber(nationalPNumber, captchaVerifier);
        this.setState({ confirmationResult });
      } catch (e) {
<<<<<<< HEAD
        this.setState({ errorMsg: `Listener Error: ${e.message}` });
      }
    }
  }
=======
        Alert.alert('핸드폰 인증에 요청에 문제가 있습니다, 재시도해 주세요');
      }
    }
  };
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b

  render() {
    const {
      confirmationResult,
      phoneNumber,
      code,
      phoneNumberValErrMessage,
      codeValErrMessage,
<<<<<<< HEAD
      logMsg,
      errorMsg,
    } = this.state;
    let authReadOnly = true;
    if (!confirmationResult) {
=======
    } = this.state;
    let authTitleStyle = styles.title;
    let authReadOnly = true;
    if (!confirmationResult) {
      authTitleStyle = styles.titleDisable;
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
      authReadOnly = false;
    }

    return (
      <View style={styles.container}>
        <View style={styles.itemWrap}>
          <Title fill={!!phoneNumber}>핸드폰번호: </Title>
          <TextInput
            style={styles.loginTI}
            value={phoneNumber}
            keyboardType="phone-pad"
            onChangeText={(text) => {
              this.onPhoneChange(text);
            }}
            placeholder="휴대전화 번호입력(숫자만)"
<<<<<<< HEAD
            onEndEditing={() => {
              const formatPN = formatTelnumber(phoneNumber);
              this.setState({ phoneNumber: formatPN });
            }}
=======
            onEndEditing={() => { const formatPN = formatTelnumber(phoneNumber); this.setState({phoneNumber: formatPN})}}
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
            onSubmitEditing={() => this.onPhoneComplete()}
            editable={!authReadOnly}
          />
          <JBErrorMessage errorMSG={phoneNumberValErrMessage} />
          <Title fill={!!code}>인증코드: </Title>
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
<<<<<<< HEAD
=======
            onSubmitEditing={() => this.onSignIn()}
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
          />
          <JBErrorMessage errorMSG={codeValErrMessage} />
        </View>

        <View style={styles.commWrap}>
          {!confirmationResult ? (
            <JBButton title="전화번호 인증하기" onPress={() => this.onPhoneComplete()} />
          ) : (
            <CommWrap>
              <JBButton title="취소" onPress={() => this.cancelSignIn()} />
              <JBButton title="로그인하기" onPress={() => this.onSignIn()} Primary />
            </CommWrap>
          )}
        </View>
<<<<<<< HEAD
        {phoneNumber === '010-5202-3337' || phoneNumber === '010-8755-7407' ? (
          <View>
            <LogMsg>
              {logMsg}
            </LogMsg>
            <ErrorMsg>
              {errorMsg}
            </ErrorMsg>
          </View>
        ) : null}
=======
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
      </View>
    );
  }
}

export default withLogin(LoginScreen);
