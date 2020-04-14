import * as React from 'react';
import * as firebase from 'firebase/app';

import { Alert, StyleSheet, View } from 'react-native';
import {
  FirebaseAuthApplicationVerifier,
  FirebaseRecaptchaVerifierModal
} from 'expo-firebase-recaptcha';
import { formatTelnumber, isPhoneNumberFormat } from 'utils/StringUtils';

import JBButton from 'molecules/JBButton';
import JBErrorMessage from 'organisms/JBErrorMessage';
import { WebView } from 'react-native-webview';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import getString from 'src/STRING';
import { getUserInfo } from 'utils/FirebaseUtils';
import { notifyError } from 'common/ErrorNotice';
import registerForPushNotificationsAsync from 'common/registerForPushNotificationsAsync';
import styled from 'styled-components/native';
import { validate } from 'utils/Validation';

const Container = styled.View`
  flex: 1;
  justify-content: center;
`;
const ModalWrap = styled.View`
  flex: 1;
  border-width: 1;
  justify-content: center;
`;
const ItemWrap = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 20;
`;
// const CommWrap = styled.View`
//   margin-top: 10;
//   flex-direction: row;
//   justify-content: flex-end;
//   margin-right: 20;
// `;
const TitleDisable = styled.View`
  width: 300;
  font-family: ${fonts.titleMiddle};
  font-size: 22;
  color: gray;
  margin-top: 20;
`;
const CommText = styled.View`
  font-size: 25;
  font-weight: bold;
  font-family: ${fonts.titleTop};
`;
const AccTypePicker = styled.View`
  width: 265;
  height: 20;
`;
const AccTypePickerItem = styled.View``;

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
  ${props =>
    props.fill &&
    `
    color: ${colors.point2};
  `}
`;
const WebViewWrap = styled.View`
  height: 400;
`;
const StyleWebView = styled(WebView)`
`;
const ErrorMsg = styled.Text`
  color: red;
`;
const ConfirmRuleWrap = styled.View``;
const RuleContents = styled.View``;
const ConfirmWrap = styled.View``;
const ConfirmCheckWrap = styled.View``;
const ConfirmCheck = styled.Text``;
const TotalConfirmCheck = styled.Text``;
const RuleTitle = styled.Text``;
const ConfirmCheckTitle = styled.Text``;
const ConfirmCheckViewBtn = styled.Text``;

const captchaUrl = 'https://jangbee-inpe21.firebaseapp.com/captcha_v3.html';

const LoginScreen: React.FC = () =>
{
  let recaptchaVerifier: FirebaseAuthApplicationVerifier;
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [completeSetPhoneNumber, setCompleteSetPhoneNumber] = React.useState(false);
  const [confirmationResult, setConfirmationResult] = React.useState();
  const [verificationId, setVerificationId] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState<string>();
  const [capchaListener, setCapchaListener] = React.useState('');
  const [phoneNumberValErrMessage, setPhoneNumberValErrMessage] = React.useState('');
  const [codeValErrMessage, setCodeValErrMessage] = React.useState('');

  const onSignIn = async () =>
  {
    const { changeAuthPath } = this.props;
    const { confirmationResult, code } = this.state;

    // Validation
    const v = validate('decimal', code, true);
    if (!v[0])
    {
      this.setState({ codeValErrMessage: v[1] });
      return;
    }

    confirmationResult
      .confirm(code)
      .then(result =>
      {
        const { user } = result;

        registerForPushNotificationsAsync(user.uid);
        getUserInfo(user.uid)
          .then(data =>
          {
            const userInfo = data.val();
            if (!userInfo)
            {
              changeAuthPath(2, user);
              return;
            }

            const { userType } = userInfo;

            if (!userType)
            {
              changeAuthPath(2, user);
            }
            else
            {
              changeAuthPath(1);
            }
          })
          .catch(error =>
            notifyError(
              'FB 사용자 정보 요청 실패',
              `사용자 정보 요청에 문제가 있습니다, 다시 시도해 주세요(${
                error.message
              })`
            )
          );
      })
      .catch(error =>
      {
        Alert.alert('잘못된 인증 코드입니다', error.message);
      });
  };

  const cancelSignIn = () =>
  {
    this.setState({
      phoneNumber: '',
      confirmationResult: undefined,
      code: ''
    });
  };

  const convertNationalPN = phoneNumber =>
  {
    const koreaNationalPhoneNumber = '+82';

    if (phoneNumber === '')
    {
      return undefined;
    }
    let newPN = phoneNumber.replace(/-/g, ''); // without hyphen

    newPN = newPN.substring(1); // Remove 010 -> 10

    return `${koreaNationalPhoneNumber}${newPN}`;
  };

  /**
   * Validation 에러 메세지 초기화
   */
  const resetValErrMsg = () =>
  {
    setPhoneNumberValErrMessage('');
    setCodeValErrMessage('');
  };

  const onPhoneComplete = async () =>
  {
    resetValErrMsg();
  };

  const setCaptchaListener = async token =>
  {
    const { phoneNumber } = this.state;

    const pnWithoutHyphen = phoneNumber.replace(/-/g, '');

    // Validation
    const v = validate('cellPhone', pnWithoutHyphen, true);
    if (!v[0])
    {
      this.setState({ phoneNumberValErrMessage: v[1] });
      return;
    }

    if (token)
    {
      const nationalPNumber = convertNationalPN(pnWithoutHyphen);

      // fake firebase.auth.ApplicationVerifier
      const captchaVerifier = {
        type: 'recaptcha',
        verify: () => Promise.resolve(token)
      };
      try
      {
        const confirmationResult = await firebase
          .auth()
          .signInWithPhoneNumber(nationalPNumber, captchaVerifier);
        this.setState({ confirmationResult });
      }
      catch (e)
      {
        this.setState({ errorMsg: `Listener Error: ${e.message}` });
      }
    }
  };

  const onPressConfirmVerificationCode = async () =>
  {
    const { verificationId, verificationCode } = this.state;
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    const authResult = await firebase.auth().signInWithCredential(credential);
  };

  const onPressSendVerificationCode = async () =>
  {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );
    setVerificationId(verificationId);
  };

  let authReadOnly = true;
  if (!confirmationResult)
  {
    authReadOnly = false;
  }

  return (
    <Container>
      <ItemWrap>
        <Title fill={!!phoneNumber}>핸드폰번호: </Title>
        <TextInput
          value={phoneNumber}
          keyboardType="phone-pad"
          onChangeText={text =>
          {
            setPhoneNumber(text);
            if (!text) { setCompleteSetPhoneNumber(false) }
            if (isPhoneNumberFormat(text)) { setCompleteSetPhoneNumber(true); setPhoneNumberValErrMessage('') }
          }}
          placeholder="휴대전화 번호입력(숫자만)"
          onEndEditing={() =>
          {
            const formatPN = formatTelnumber(phoneNumber);
            if (isPhoneNumberFormat(phoneNumber)) { setCompleteSetPhoneNumber(true); setPhoneNumberValErrMessage('') }
            else { setPhoneNumberValErrMessage(getString('VALIDATION_PHONENUMBER')) }
          }}
          onSubmitEditing={() => onPhoneComplete()}
          editable={!authReadOnly}
        />
        <JBErrorMessage errorMSG={phoneNumberValErrMessage} />
        <Title fill={!!code}>인증코드: </Title>
        <TextInput
          value={verificationCode}
          onChangeText={text =>
          {
            onCodeChange(text);
          }}
          keyboardType="numeric"
          placeholder="SMS 인증코드 입력"
          editable={authReadOnly}
        />
        <JBErrorMessage errorMSG={codeValErrMessage} />
      </ItemWrap>

      <CommWrap>
        {!confirmationResult ? (
          <JBButton
            title="전화번호 인증하기"
            onPress={(): void => onPhoneComplete()}
          />
        ) : (
          <CommWrap>
            <JBButton title="취소" onPress={(): void => cancelSignIn()} />
            <JBButton
              title="로그인하기"
              onPress={(): void => onSignIn()}
              Primary
            />
          </CommWrap>
        )}
      </CommWrap>
      {completeSetPhoneNumber && (
        <>
          <FirebaseRecaptchaVerifierModal
            ref={ref => recaptchaVerifier = ref}
            firebaseConfig={firebase.app().options} />
          <ConfirmRuleWrap>
            <RuleTitle>이용약관 동의</RuleTitle>
            <RuleContents>
              <TotalConfirmCheck>전체동의</TotalConfirmCheck>
              <ConfirmWrap>
                <ConfirmCheckWrap>
                  <ConfirmCheck>*</ConfirmCheck>
                  <ConfirmCheckTitle>Google 전화번호 인증(전화번호 변경전, 탈퇴필수)</ConfirmCheckTitle>
                </ConfirmCheckWrap>
                <ConfirmCheckViewBtn>내용 보기</ConfirmCheckViewBtn>
              </ConfirmWrap>
              <ConfirmWrap>
                <ConfirmCheckWrap>
                  <ConfirmCheck>*</ConfirmCheck>
                  <ConfirmCheckTitle>서비스 이용약관</ConfirmCheckTitle>
                </ConfirmCheckWrap>
                <ConfirmCheckViewBtn>내용 보기</ConfirmCheckViewBtn>
              </ConfirmWrap>
              <ConfirmWrap>
                <ConfirmCheckWrap>
                  <ConfirmCheck>*</ConfirmCheck>
                  <ConfirmCheckTitle>개인 정보처리방침</ConfirmCheckTitle>
                </ConfirmCheckWrap>
                <ConfirmCheckViewBtn>내용 보기</ConfirmCheckViewBtn>
              </ConfirmWrap>
            </RuleContents>
          </ConfirmRuleWrap>
        </>
      )}
    </Container>
  );
};

export default LoginScreen;
