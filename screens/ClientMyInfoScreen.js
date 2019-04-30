import React from 'react';
import { Alert, Linking } from 'react-native';
import firebase from 'firebase';
import Styled from 'styled-components';
import { withLogin } from '../contexts/LoginProvider';
import JBButton from '../components/molecules/JBButton';
import JBTextItem from '../components/molecules/JBTextItem';
import Card from '../components/molecules/CardUI';

const Container = Styled.View`
  flex: 1;
`;

class ClientMyInfoScreen extends React.PureComponent {
  /**
   * 로그아웃 함수
   */
  onSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      Alert.alert('로그아웃에 문제가 있습니다, 재시도해 주세요.');
    }
  };

  render() {
    const { user } = this.props;

    return (
      <Container>
        <Card>
          <JBTextItem title="전화번호" value={user.phoneNumber} align="center" row />
        </Card>
        <JBButton
          title="장비콜 메일 문의하기"
          onPress={() => Linking.openURL('mailto:jb9229@gmail.com')}
          size="full"
          Secondary
        />
        <JBButton
          title="로그아웃"
          onPress={() => this.onSignOut()}
          size="small"
          underline
          align="center"
        />
      </Container>
    );
  }
}

export default withLogin(ClientMyInfoScreen);
