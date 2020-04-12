import 'firebase/auth';

import * as React from 'react';
import * as firebase from 'firebase/app';

import { Button, SafeAreaView, TextInput, View } from 'react-native';
import {
  FirebaseAuthApplicationVerifier,
  FirebaseRecaptchaVerifierModal
} from 'expo-firebase-recaptcha';
import { boolean, text } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react-native';

// import * as firebase from 'firebase/app';

const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('사용자', module)
  .addDecorator(SafeZonDecorator)
  .add('로그인', () => React.createElement(() =>
  {
    let recaptchaVerifier: FirebaseAuthApplicationVerifier;

    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [verificationCode, setVerificationCode] = React.useState('');

    const onPressSendVerificationCode = async () =>
    {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier
      );
      setVerificationCode(verificationId);
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
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <FirebaseRecaptchaVerifierModal
          ref={ref => recaptchaVerifier = ref}
          firebaseConfig={firebase.app().options} />
        <TextInput
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeValue={(phoneNumber): void => setPhoneNumber(phoneNumber)} />
        <Button title='Send Verification Code' onPress={onPressSendVerificationCode} />
        <TextInput
          onChangeValue={(verificationCode): void => setVerificationCode(verificationCode)} />
        <Button title='Confirm Verification Code' onPress={onPressConfirmVerificationCode} />
      </View>
    );
  }))
;
