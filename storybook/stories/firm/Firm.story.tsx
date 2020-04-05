import * as React from 'react';
import * as imageManager from 'common/ImageManager';

import { Alert, Button, SafeAreaView, Text } from 'react-native';
import { boolean, text } from '@storybook/addon-knobs';

import FirmModifyScreen from 'src/container/firm/modify';
import FirmRegisterScreen from '../../../src/container/firm/create';
import ImagePickInput from 'molecules/ImagePickInput';
import JBButton from 'molecules/JBButton';
import LoadingIndicator from 'molecules/LoadingIndicator';
import { User } from 'firebase';
import { storiesOf } from '@storybook/react-native';
import { useLoginProvider } from 'src/contexts/LoginProvider';

const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('업체', module)
  .addDecorator(SafeZonDecorator)
  .add('등록', () => React.createElement(() =>
  {
    const { setUser, setUserProfile } = useLoginProvider();
    const user: User =
    {
      uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', displayName: null, email: null,
      phoneNumber: '01052023337', photoURL: '', providerId: ''
    };

    React.useEffect(() =>
    {
      setUser(user);
      setUserProfile({ userType: 2, sid: undefined });
    }, []);

    return (
      <FirmRegisterScreen
        navigation={{
          navigate: (path: string, params: object): void =>
          { if (path === 'WorkList') { Alert.alert('Success Story, Registry Work') } },
          state: {
            params: (): void => console.log('navigate() called!')
          }
        }}
      />
    );
  }))
  .add('수정', () => React.createElement(() =>
  {
    const { user, setUser, setUserProfile } = useLoginProvider();
    const storyUser: User =
    {
      uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', displayName: null, email: null,
      phoneNumber: '01052023337', photoURL: '', providerId: ''
    };

    React.useEffect(() =>
    {
      setUser(storyUser);
      setUserProfile({ userType: 2, sid: undefined });
    }, []);

    if (!user || !user.uid) { return <LoadingIndicator loading={true} /> }
    return (
      <FirmModifyScreen
        navigation={{
          navigate: (path: string, params: object): void =>
          { if (path === 'WorkList') { Alert.alert('Success Story, Registry Work') } },
          state: {
            params: (): void => console.log('navigate() called!')
          }
        }}
      />
    );
  }))
  .add('이미지 업로드', () => React.createElement(() =>
  {
    const [img, setImg] = React.useState();
    const [uploadedImg, setIUploadedImg] = React.useState();
    return (
      <>
        <ImagePickInput
          itemTitle="작업사진3"
          imgUrl={img || ''}
          setImageUrl={(url): void => { setImg(url) }}
        />
        <Text>{uploadedImg}</Text>
        <JBButton title="이미지 업로드"
          onPress={async (): Promise<void> => { const imgUrl = await imageManager.uploadImage(img); setIUploadedImg(imgUrl) }}/>
      </>
    );
  }));
