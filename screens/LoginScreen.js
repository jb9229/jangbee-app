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
import colors from '../constants/Colors';
import { validate } from '../utils/Validation';
import FirmCreaErrMSG from '../components/FirmCreaErrMSG';

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

const USER_CLIENT = 1;
const USER_FIRM = 2;
export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      confirmationResult: undefined,
      code: '',
      userType: USER_CLIENT,
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

  /**
   * Firebase user DB에 사용자 추가정보 저장
   */
  updateUserExtraData = async (user) => {
    const { userType } = this.state;

    await firebase
      .database()
      .ref(`users/${user.uid}`)
      .set({
        userType,
      });
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

    await confirmationResult
      .confirm(code)
      .then((result) => {
        const { user } = result;
        console.log(user);

        this.updateUserExtraData(user);
        navigation.navigate('Main', { user });
      })
      .catch((error) => {
        Alert.alert(`잘못된 인증 코드입니다: ${error}`);
      });
  };

  onSignOut = async () => {
    try {
      await firebase.auth().signOut();
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

  onChangeUserType = (userType) => {
    this.setState({ userType });
  };

  render() {
    const {
      confirmationResult,
      phoneNumber,
      code,
      userType,
      phoneNumberValErrMessage, codeValErrMessage,
    } = this.state;
    let authTitleStyle = styles.title;
    let authReadOnly = true;
    if (!confirmationResult) {
      authTitleStyle = styles.titleDisable;
      authReadOnly = false;
    }

    return (
      <View style={styles.container}>
        <View style={styles.accoutTypeWrap}>
          <TouchableOpacity
            style={[styles.accountTypeTO, userType === USER_CLIENT ? styles.selectedAccType : null]}
            onPress={() => this.onChangeUserType(USER_CLIENT)}
          >
            <Text style={[styles.accountTypeText]}>장비고객</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.accountTypeTO, userType === USER_FIRM ? styles.selectedAccType : null]}
            onPress={() => this.onChangeUserType(USER_FIRM)}
          >
            <Text style={[styles.accountTypeText]}>장비업체 </Text>
          </TouchableOpacity>
        </View>
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
            placeholder="SMS로 받은 인증코드 숫자입력"
            editable={authReadOnly}
          />
          <FirmCreaErrMSG errorMSG={codeValErrMessage} />
        </View>

        <View style={styles.commWrap}>
          {!confirmationResult ? (
            <TouchableHighlight onPress={() => this.onPhoneComplete()}>
              <Text style={styles.commText}>휴대전화 번호인증</Text>
            </TouchableHighlight>
          ) : (
            <TouchableHighlight onPress={() => this.onSignIn()}>
              <Text style={styles.commText}>로그인</Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
    );
  }
}
