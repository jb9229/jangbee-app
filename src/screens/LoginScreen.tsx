import * as React from 'react';
import * as firebase from 'firebase/app';

import { FirebaseAuthApplicationVerifier, FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { formatTelnumber, isPhoneNumberFormat } from 'utils/StringUtils';

import AgreementTerms from 'src/components/organisms/AgreementTerms';
import EditText from 'src/components/molecules/EditText';
import JBButton from 'molecules/JBButton';
import { StyleKeyboardAvoidingView } from 'src/CommonStyle';
import getString from 'src/STRING';
import { getUserInfo } from 'utils/FirebaseUtils';
import { notifyError } from 'common/ErrorNotice';
import registerForPushNotificationsAsync from 'common/registerForPushNotificationsAsync';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
`;
const KeyboardAvoidingView = styled(StyleKeyboardAvoidingView)`
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

interface Props {
  changeAuthPath: (path: number, data?: any) => void;
}

const LoginScreen: React.FC<Props> = (props) =>
{
  let recaptchaVerifier: FirebaseAuthApplicationVerifier;
  let verificationCode: string;
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [isValidPhoneNumber, setValidPhoneNumber] = React.useState(false);
  const [verificationId, setVerificationId] = React.useState('');
  const [phoneNumberValErrMessage, setPhoneNumberValErrMessage] = React.useState('');
  const [codeValErrMessage, setCodeValErrMessage] = React.useState('');
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  const onSignIn = (user) =>
  {
    registerForPushNotificationsAsync(user.uid);
    getUserInfo(user.uid)
      .then(data =>
      {
        console.log('>>> getUserInfo~~');
        const userInfo = data.val();
        if (!userInfo)
        {
          props.changeAuthPath(2, user);
          return;
        }

        const { userType } = userInfo;

        if (!userType)
        {
          props.changeAuthPath(2, user);
        }
        else
        {
          props.changeAuthPath(1);
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
  };

  const cancelSignIn = () =>
  {
    setPhoneNumber('');
    setValidPhoneNumber(false);
    setVerificationId('');
    setAgreeTerms(false);
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
    console.log('>>> onPressConfirmVerificationCode~~');
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    const authResult = await firebase.auth().signInWithCredential(credential);
    console.log('>>> authResult:');
    if (authResult?.user?.uid)
    {
      onSignIn(authResult.user);
    }
    else
    {
      setCodeValErrMessage('인증코드가 올바르지 않습니다');
    }
    console.log('>>> authResult: ', authResult);
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
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-150}>
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
            unchangeable={verificationId}
            errorText={phoneNumberValErrMessage}
          />
          {!!verificationId && (
            <>
              <EditText
                label="인증코드"
                onChangeText={(text): void => { verificationCode = text }}
                keyboardType="numeric"
                placeholder="SMS 인증코드 입력"
                errorText={codeValErrMessage}
              />
            </>
          )}
        </ItemWrap>

        <CommWrap>
          {!verificationId ? (
            agreeTerms && !!isValidPhoneNumber && (
              <JBButton
                title="전화번호 인증하기"
                onPress={(): Promise<void> => onPressSendVerificationCode()}
                Secondary
              />
            )
          ) : (
            <CommWrap>
              <JBButton title="취소" onPress={(): void => cancelSignIn()} Secondary/>
              <JBButton
                title="로그인하기"
                onPress={(): Promise<void> => onPressConfirmVerificationCode()}
                Primary
              />
            </CommWrap>
          )}
        </CommWrap>
        {isValidPhoneNumber && !verificationId && (
          <>
            <FirebaseRecaptchaVerifierModal
              title="'로봇이 아닙니다' 클릭해 주세요"
              ref={(ref) => { recaptchaVerifier = ref }}
              firebaseConfig={firebase.app().options}
            />
            <AgreementTerms onChange={setAgreeTerms} />
          </>
        )}
      </KeyboardAvoidingView>
    </Container>
  );
};

export default LoginScreen;
