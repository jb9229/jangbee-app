import * as React from 'react';

import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';

const Container = styled.View`
`;
const Modal = styled.Modal``;
const Contents = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

interface Props {
  initUrl: string;
  visible: boolean;
  close: () => void;
}

const KakaoPayWebView: React.FC<Props> = (props) =>
{
  let webView;

  return (
    <Container>
      <Modal
        animationType="slide"
        transparent
        visible={props.visible}
        onRequestClose={props.close}
      >
        <Contents>
          <WebView
            ref={view =>
            {
              webView = view;
            }}
            source={{
              uri: props.initUrl
            }}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={() => {}}
            onLoadEnd={() => {}}
            style={{
              width: 380,
              height: 600,
              marginTop: 5,
              marginLeft: 5,
              marginRight: 5
            }}
            onMessage={event =>
              receiveWebViewMSG(webView, event.nativeEvent.data, props.close)
            }
          />
        </Contents>
      </Modal>
    </Container>
  );
};

/**
 * Webview url 상태변경 이벤트처리 함수(사용자 인증에러 처리, 프로바이더 페이지가 호출되기 전에 에러 처리)
 */
const handleNavigationStateChange = (navState: any): void =>
{
  // Callback url로 redirect가 되는 것이 아니라 json으로 리턴된다. 그때의 상태를 잡아 에러 처리
};

/**
 * 웹페이지 메세지 처리 함수
 * @param {string} webViewMSG Webview에서 전달된 메세지
 */
const receiveWebViewMSG = async (webView, webViewMSG, close: () => void): Promise<any> =>
{
  const webData = JSON.parse(webViewMSG);
  let postData;
  // 웹뷰 종료 요청
  if (webData.type === 'ASK_WEBVIEWCLOSE')
  {
    close();
  }

  if (webView && postData != null)
  {
    webView.postMessage(postData);
  }
};

export default KakaoPayWebView;
