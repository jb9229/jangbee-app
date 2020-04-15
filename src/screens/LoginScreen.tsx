import * as React from 'react';
import * as firebase from 'firebase/app';

import {
  FirebaseAuthApplicationVerifier,
  FirebaseRecaptchaVerifierModal
} from 'expo-firebase-recaptcha';
import { formatTelnumber, isPhoneNumberFormat } from 'utils/StringUtils';

import AgreementTerms from 'src/components/organisms/AgreementTerms';
import { Alert } from 'react-native';
import EditText from 'src/components/molecules/EditText';
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
const ItemWrap = styled.View`
  justify-content: center;
  margin-bottom: 20;
  padding: 20px 20px;
`;

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

const captchaUrl = 'https://jangbee-inpe21.firebaseapp.com/captcha_v3.html';

const LoginScreen: React.FC = () =>
{
  let recaptchaVerifier: FirebaseAuthApplicationVerifier;
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [isValidPhoneNumber, setValidPhoneNumber] = React.useState(false);
  const [verificationId, setVerificationId] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState<string>();
  const [phoneNumberValErrMessage, setPhoneNumberValErrMessage] = React.useState('');
  const [codeValErrMessage, setCodeValErrMessage] = React.useState('');
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  const onSignIn = async () =>
  {
    const { changeAuthPath } = this.props;
    const { code } = this.state;

    // Validation
    const v = validate('decimal', code, true);
    if (!v[0])
    {
      this.setState({ codeValErrMessage: v[1] });
    }

    // confirmationResult
    //   .confirm(code)
    //   .then(result =>
    //   {
    //     const { user } = result;

    //     registerForPushNotificationsAsync(user.uid);
    //     getUserInfo(user.uid)
    //       .then(data =>
    //       {
    //         const userInfo = data.val();
    //         if (!userInfo)
    //         {
    //           changeAuthPath(2, user);
    //           return;
    //         }

    //         const { userType } = userInfo;

    //         if (!userType)
    //         {
    //           changeAuthPath(2, user);
    //         }
    //         else
    //         {
    //           changeAuthPath(1);
    //         }
    //       })
    //       .catch(error =>
    //         notifyError(
    //           'FB 사용자 정보 요청 실패',
    //           `사용자 정보 요청에 문제가 있습니다, 다시 시도해 주세요(${
    //             error.message
    //           })`
    //         )
    //       );
    //   })
    //   .catch(error =>
    //   {
    //     Alert.alert('잘못된 인증 코드입니다', error.message);
    //   });
  };

  const cancelSignIn = () =>
  {
    setPhoneNumber('');
  };

  const convertNationalPN = (phoneNumber): string =>
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
      convertNationalPN(phoneNumber),
      recaptchaVerifier
    );
    setVerificationId(verificationId);
  };

  return (
    <Container>
      <ItemWrap>
        <EditText
          label="핸드폰 번호"
          subLabel="(숫자만)"
          text={phoneNumber}
          keyboardType="phone-pad"
          onChangeText={(text): void =>
          {
            if (isPhoneNumberFormat(text))
            {
              const formatPN = formatTelnumber(text);
              setPhoneNumber(formatPN);
              setValidPhoneNumber(true);
              setPhoneNumberValErrMessage('');
            }
            else
            {
              setValidPhoneNumber(false);
              if (text) { setPhoneNumber(text.replace(/-/g, '')) }
            }
          }}
          placeholder="숫자만 입력해 주세요(0101234567)"
          onEndEditing={(): void =>
          {
            if (!isPhoneNumberFormat(phoneNumber)) { setPhoneNumberValErrMessage(getString('VALIDATION_PHONENUMBER')) }
          }}
          onSubmitEditing={() => onPhoneComplete()}
          editable={!verificationId}
          errorText={phoneNumberValErrMessage}
        />
        {!!verificationId && (
          <>
            <EditText
              label="인증코드"
              text={verificationCode}
              onChangeText={(text) => {}}
              keyboardType="numeric"
              placeholder="SMS 인증코드 입력"
              errorText={codeValErrMessage}
            />
          </>
        )}
      </ItemWrap>

      <CommWrap>
        {!verificationId ? (
          !!isValidPhoneNumber && (
            <JBButton
              title="전화번호 인증하기"
              onPress={(): void => onPressSendVerificationCode()}
              Secondary
            />
          )
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
      {isValidPhoneNumber && !verificationId && (
        <>
          <FirebaseRecaptchaVerifierModal
            ref={ref => recaptchaVerifier = ref}
            firebaseConfig={firebase.app().options}
          />
          <AgreementTerms onChange={setAgreeTerms} />
        </>
      )}
    </Container>
  );
};

export default LoginScreen;
