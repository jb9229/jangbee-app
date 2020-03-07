/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react';

import { Linking, Platform } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { WebViewErrorEvent, WebViewHttpErrorEvent } from 'react-native-webview/lib/WebViewTypes';

import SendIntentAndroid from 'react-native-send-intent';
import { noticeUserError } from 'src/container/request';
import styled from 'styled-components/native';

const Container = styled.View`
`;
const Modal = styled.Modal``;
const Contents = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export class KakaoPaymentInfo
{
  constructor (authKey: string, url: string, tid: string, uid: string, orderId: string)
  {
    this.authKey = authKey;
    this.nextRedirectMobileUrl = url;
    this.tid = tid;
    this.partner_user_id = uid;
    this.partner_order_id = orderId;
  }

  authKey: string;
  nextRedirectMobileUrl: string;
  tid: string;
  partner_user_id: string;
  partner_order_id: string;
  cid?: string;
  cid_secret = 'temp_cid_secret';
}

interface Props {
  paymentInfo: KakaoPaymentInfo;
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
            ref={(view): void =>
            {
              webView = view;
            }}
            originWhitelist={['*']}
            source={{
              uri: props.paymentInfo ? props.paymentInfo.nextRedirectMobileUrl : ''
            }}
            onShouldStartLoadWithRequest={(e) => handleShouldStartLoadWithRequest(e, webView)}
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
            onMessage={(event): void => receiveWebViewMSG(webView, event.nativeEvent.data, props.paymentInfo, props.close)}
            onError={(err: WebViewErrorEvent): void =>
            {
              console.log('### onError ###');
              console.log(err);
            }
            }
            onHttpError={(syntheticEvent: WebViewHttpErrorEvent): void =>
            {
              const { nativeEvent } = syntheticEvent;
              console.log('### onHttpError ###');
              console.log(nativeEvent);
              console.warn(
                'WebView received error status code: ',
                nativeEvent.statusCode
              );
            }}
          />
        </Contents>
      </Modal>
    </Container>
  );
};

/**
 * Webview url 상태변경 이벤트처리 함수(사용자 인증에러 처리, 프로바이더 페이지가 호출되기 전에 에러 처리)
 */
const handleShouldStartLoadWithRequest = (evt: any, webView): boolean =>
{
  if (evt.url.startsWith('http://') || evt.url.startsWith('https://') || evt.url.startsWith('about:blank'))
  {
    return true;
  }

  // webView.goBack();
  if (Platform.OS === 'android')
  {
    SendIntentAndroid.openAppWithUri(evt.url)
      .then(isOpened =>
      {
        if (!isOpened)
        {
          noticeUserError('외부 앱 실행에 실패했습니다', '외부 앱 실행에 실패했습니다', `evt.url is: ${evt.url}`);
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
      noticeUserError('외부 앱 실행에 실패했습니다', '외부 앱 실행에 실패했습니다', `evt.url is: ${err.message}`);
    });
  }

  return false;

  // Callback url로 redirect가 되는 것이 아니라 json으로 리턴된다. 그때의 상태를 잡아 에러 처리
};

/**
 * Webview url 상태변경 이벤트처리 함수(사용자 인증에러 처리, 프로바이더 페이지가 호출되기 전에 에러 처리)
 */
const handleNavigationStateChange = (evt: WebViewNavigation): void =>
{
  console.log('handleNavigationStateChange');

  // Callback url로 redirect가 되는 것이 아니라 json으로 리턴된다. 그때의 상태를 잡아 에러 처리
};

/**
 * 웹페이지 메세지 처리 함수
 * @param {string} webViewMSG Webview에서 전달된 메세지
 */
const receiveWebViewMSG = (webView: any, webViewMSG: any, paymentInfo: KakaoPaymentInfo, close: () => void): void =>
{
  const webData = JSON.parse(webViewMSG);

  console.log('### Received Web Data ####');
  console.log(webData);

  // 웹뷰 종료 요청
  if (webData.type === 'ASK_WEBVIEWCLOSE')
  {
    close();
  }

  // 웹뷰 종료 요청
  if (webData.type === 'ASK_APPROVAL_INFO')
  {
    webView.postMessage(JSON.stringify(paymentInfo));
  }

  if (webView)
  {
    const sendData = {};
    webView.postMessage(sendData);
  }
};

export default KakaoPayWebView;
