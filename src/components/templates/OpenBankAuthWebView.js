import * as obconfig from '../../../openbank-config';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Text
} from 'react-native';
import { OPENBANK_AUTHORIZE2, OPENBANK_REAUTHORIZE2 } from 'constants/Url';

import React from 'react';
import { WebView } from 'react-native-webview';
import moment from 'moment';
import styled from 'styled-components/native';
import { updateReAuthInfo } from 'utils/FirebaseUtils';
import { withLogin } from 'src/contexts/LoginProvider';

const TYPE_REAUTH = 'REAUTH';
const ADD_ACCOUNT = 'ADD_ACCOUNT';

const Container = styled.View`
  flex: 1;
`;
const Contents = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const NoticeWrap = styled.View`
  background-color: white;
`;
class OpenBankAuthWebView extends React.Component
{
  constructor (props)
  {
    super(props);

    this.state = {
      isWebViewLoadingComplete: false,
      noticeMSG: ''
    };
  }

  componentDidMount ()
  {
    // Test Code I have to know 'HOC Jest Testing'
    // const tokenData = {
    //   access_token: 'test',
    //   token_type: 'tokenData.',
    //   expires_in: 'tokenData.',
    //   refresh_token: 'tokenData.',
    //   scope: 'tokenData.scope',
    //   user_seq_no: 'tokenData.user_seq_no',
    // };
    // this.saveOpenBankTokenInfo(tokenData);
  }

  /**
   * 사용자정보에서 fintech_use_num 추출 함수
   * @param {Array} oriAccList 핀테크이용번호 리스트
   * @param {Array<Object>} accountListInfo 계좌목록정보
   */
  getOpenbankAccInfo = (oriAccList, accountListInfo) =>
  {
    const accList = accountListInfo.res_list;

    // validation
    if (accList.length !== oriAccList.length + 1)
    {
      Alert.alet(
        '유효하지 않은 핀테크이용번호가 존재하여 원통장의 핀테크이용번호를 찾을 수 없습니다, 관리자에게 문의 부탁 드립니다.'
      );
    }

    // make FintechUseNum List
    const fintechUseNumList = [];
    oriAccList.forEach(oriAccount =>
    {
      fintechUseNumList.push(oriAccount.fintechUseNum);
    });

    accList.forEach(accInfo =>
    {
      const candidateFUN = accInfo.fintech_use_num;
      if (!fintechUseNumList.includes(candidateFUN))
      {
        return accInfo;
      }
    });

    return undefined;
  };

  /**
   * 웹뷰 종료 함수
   */
  closeWebView = () =>
  {
    const { type, navigation, completeAction } = this.props;

    this.setState({ noticeMSG: '곧(10초) 창이 닫힙니다~' });

    setTimeout(() =>
    {
      completeAction();
    }, 5000);
  };

  /**
   * Webview url 상태변경 이벤트처리 함수(사용자 인증에러 처리, 프로바이더 페이지가 호출되기 전에 에러 처리)
   */
  handleNavigationStateChange = navState =>
  {
    // Callback url로 redirect가 되는 것이 아니라 json으로 리턴된다. 그때의 상태를 잡아 에러 처리
  };

  /**
   * 웹페이지 메세지 처리 함수
   * @param {string} webViewMSG Webview에서 전달된 메세지
   */
  receiveWebViewMSG = async webViewMSG =>
  {
    const { type, navigation } = this.props;

    const webData = JSON.parse(webViewMSG);
    let postData = null;

    // 오픈뱅크정보 요청
    if (webData.type === 'ASK_BANKAPIINFO')
    {
      const apiData = {
        client_id: obconfig.client_id,
        client_secret: obconfig.client_secret,
        redirect_uri: obconfig.redirect_uri
      };

      postData = JSON.stringify(apiData);
    }

    // 웹뷰 종료 요청
    if (webData.type === 'ASK_WEBVIEWCLOSE')
    {
      navigation.navigate('AdCreate', { action: 'RELOAD' });
    }

    // 인증토큰 저장 요청
    if (webData.type === 'ASK_SAVETOKEN')
    {
      if (type === ADD_ACCOUNT)
      {
        // TODO user에 자동이체 정보 서버에등록,
      }

      this.saveOpenBankTokenInfo(webData.data);

      this.closeWebView();
    }

    if (postData != null)
    {
      this.webView.postMessage(postData);
    }
  };

  saveOpenBankTokenInfo = async tokenData =>
  {
    const { navigation, user, refreshUserOBInfo } = this.props;

    const expireDate = moment()
      .add(90, 'day')
      .format('YYYY-MM-DD');
    const discDate = moment()
      .add(1, 'year')
      .format('YYYY-MM-DD');
    const tokenInfo = {
      obAccessToken: tokenData.access_token,
      obRefreshToken: tokenData.refresh_token,
      obAccTokenExpDate: expireDate,
      obAccTokenDiscDate: discDate,
      obUserSeqNo: tokenData.user_seq_no
    };

    await updateReAuthInfo(
      user.uid,
      tokenInfo.obAccessToken,
      tokenInfo.obRefreshToken,
      tokenInfo.obAccTokenExpDate,
      tokenInfo.obAccTokenDiscDate,
      tokenInfo.obUserSeqNo,
      error =>
      {
        Alert.alert(
          '저장 실패',
          `${error} 오픈뱅크재인증 정보 FB Database 저장에 실패 했습니다`
        );
      }
    );

    refreshUserOBInfo();

    return true;
  };

  render ()
  {
    const { type, navigation, isVisibleModal, closeModal } = this.props;
    const { isWebViewLoadingComplete, noticeMSG } = this.state;

    let authUrl;
    if (type === ADD_ACCOUNT)
    {
      authUrl = OPENBANK_AUTHORIZE2;
    }
    else if (type === TYPE_REAUTH)
    {
      authUrl = OPENBANK_REAUTHORIZE2;
    }

    const paramData = {
      client_id: obconfig.client_id,
      response_type: 'code',
      lang: '',
      edit_option: '',
      scope: 'login inquiry transfer',
      redirect_uri: obconfig.redirect_uri,
      client_info: 'test+whatever+you+want',
      auth_type: 0,
      bg_color: '#FAFAFA',
      txt_color: '#050505',
      btn1_color: '#006DB8',
      btn2_color: '#818487'
    };

    /**
     * 재인증
     * Kftc-Bfop-UserSeqNo <user_seq_no> (선택) 기존 고객의 사용자일련번호
     * Kftc-Bfop-UserCI <user_ci> (선택) 사용자 CI(Connect Info)
     * Kftc-Bfop-UserName <user_name> (선택) 사용자명
     * Kftc-Bfop-UserInfo <user_info> (선택) 생년월일(8 자리)+성별(1 자리)
     * Kftc-Bfop-UserCellNo <user_cell_no> (선택) 휴대폰번호
     * Kftc-Bfop-PhoneCarrier [skt|ktf|lgt|
     * skm|ktm|lgm] (선택)
     * 이동통신사
     * [17p] 「이동통신사 코드표」 참조
     * Kftc-Bfop-UserEmail <user_email> (선택) 이메일주소
     */

    const paramsStr = Object.keys(paramData)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(paramData[k])}`)
      .join('&');

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
              ref={view =>
              {
                this.webView = view;
              }}
              source={{
                uri: `${authUrl}?${paramsStr}`
                // uri: 'https://jb9229.github.io/openBankApiCallback/index.html',
              }}
              onNavigationStateChange={this.handleNavigationStateChange}
              onLoadStart={() =>
                this.setState({ isWebViewLoadingComplete: false })
              }
              onLoadEnd={() =>
                this.setState({ isWebViewLoadingComplete: true })
              }
              style={{
                width: 380,
                height: 600,
                marginTop: 5,
                marginLeft: 5,
                marginRight: 5
              }}
              onMessage={event =>
                this.receiveWebViewMSG(event.nativeEvent.data)
              }
            />
            <NoticeWrap>
              <Text>{noticeMSG}</Text>
            </NoticeWrap>
            {!isWebViewLoadingComplete && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </Contents>
        </Modal>
      </Container>
    );
  }
}

export default OpenBankAuthWebView;
