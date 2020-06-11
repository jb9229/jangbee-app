import { Dimensions, Linking, Platform } from 'react-native';

import React from 'react';
import SendIntentAndroid from 'react-native-send-intent';
import { WebView } from 'react-native-webview';
import { noticeUserError } from 'src/container/request';
import styled from 'styled-components/native';

const Container = styled.View`
`;
const Modal = styled.Modal``;
const Contents = styled.View`
  flex: 1;
`;

const KATALK_ASK_URL = 'https://jangbee-inpe21.firebaseapp.com/katalk_ask.html';

export default class KatalkAskWebview extends React.PureComponent
{
  receiveWebViewMSG = async (webViewMSG) =>
  {
    const webData = JSON.parse(webViewMSG);
    const postData = null;

    if (postData != null)
    {
      this.webView.postMessage(postData);
    }
  };

  render ()
  {
    const { width, height } = Dimensions.get('window');
    const { isVisibleModal, closeModal } = this.props;
    return (
      <Container>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <Contents>
            <WebView
              ref={(view) =>
              {
                this.webView = view;
              }}
              originWhitelist={['*']}
              onShouldStartLoadWithRequest={(e): boolean => handleShouldStartLoadWithRequest(e)}
              source={{ uri: KATALK_ASK_URL }}
              style={{
                width: width,
                height: height
              }}
              onMessage={event => this.receiveWebViewMSG(event.nativeEvent.data)}
            />
          </Contents>
        </Modal>
      </Container>
    );
  }
}

/**
 * Webview url 상태변경 이벤트처리 함수(사용자 인증에러 처리, 프로바이더 페이지가 호출되기 전에 에러 처리)
 */
const handleShouldStartLoadWithRequest = (evt: any): boolean =>
{
  if (evt.url.startsWith('http://') || evt.url.startsWith('https://') || evt.url.startsWith('about:blank'))
  {
    return true;
  }

  // webView.goBack();
  if (Platform.OS === 'android')
  {
    // SendIntentAndroid.openAppWithUri(evt.url)
    SendIntentAndroid.openChromeIntent(evt.url)
      .then(isOpened =>
      {
        if (!isOpened)
        {
          noticeUserError('KatalAskWebview[SendIntentAndroid.openChromeIntent]', `evt.url is: ${evt.url}`);
        }
      })
      .catch(err =>
      {
        console.log('### openAppWithUri error ###');
        console.log(err);
      });
  }
  else
  {
    Linking.openURL(evt.url).catch(err =>
    {
      noticeUserError('KatalAskWebview[Linking.openURL]', `evt.url is: ${err.message}`);
    });
  }

  return false;

  // Callback url로 redirect가 되는 것이 아니라 json으로 리턴된다. 그때의 상태를 잡아 에러 처리
};
