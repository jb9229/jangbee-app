/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react';
import * as api from 'api/api';

import { Alert, Linking, Platform } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

import SendIntentAndroid from 'react-native-send-intent';
import { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { noticeUserError } from 'src/container/request';
import styled from 'styled-components/native';
import { useLoginProvider } from 'src/contexts/LoginProvider';

const Container = styled.View`
`;
const Modal = styled.Modal``;
const Contents = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export class KakaoPaymentReadyInfo
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
  paymentInfo: KakaoPaymentReadyInfo;
  visible: boolean;
  close: () => void;
}

const KakaoPayWebView: React.FC<Props> = (props) =>
{
  let webView;
  const { setPaymentSubscription } = useLoginProvider();

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
            onShouldStartLoadWithRequest={(e): void => handleShouldStartLoadWithRequest(e, webView)}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={(): void => {}}
            onLoadEnd={(): void => {}}
            style={{
              width: 380,
              height: 600,
              marginTop: 5,
              marginLeft: 5,
              marginRight: 5
            }}
            onMessage={(event): void => receiveWebViewMSG(webView, event.nativeEvent.data, props.paymentInfo, setPaymentSubscription, props.close)}
            onError={(err: WebViewErrorEvent): void =>
            {
              console.log('### onError ###');
              console.log(err);
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
const receiveWebViewMSG = (webView: any, webViewMSG: any, paymentInfo: KakaoPaymentReadyInfo,
  setPaymentSubscription: (sid: string) => void, close: () => void): void =>
{
  const webData = JSON.parse(webViewMSG);

  console.log('### Received Web Data ####');
  console.log(webData);

  // 웹뷰 종료 요청
  if (webData.type === 'ASK_WEBVIEWCLOSE')
  {
    close();
    return;
  }

  // 결제 최종 승인요청
  if (webData.type === 'ASK_APPROVAL_INFO')
  {
    api
      .requestWorkPaymentApproval({
        ...paymentInfo, pgToken: webData.data.pg_token, partnerOrderId: paymentInfo.partner_order_id,
        partnerUserId: paymentInfo.partner_user_id
      })
      .then((result) =>
      {
        console.log(result);
        if (result && result.sid)
        {
          setPaymentSubscription(result.sid);
          close();
          Alert.alert('결제등록 완료', '일감매칭 결제 정보가 등록되었습니다, 일감지원을 완료해 주세요');
        }
        else
        {
          Alert.alert('결제등록 실패', '다시 일감매칭 결제정보를 등록해 주세요');
          close();
        }
      });

    return;
  }

  if (webView)
  {
    const sendData = {};
    webView.postMessage(sendData);
  }
};

export default KakaoPayWebView;
