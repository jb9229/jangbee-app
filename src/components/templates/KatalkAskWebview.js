import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
`;
const Modal = styled.Modal``;
const Contents = styled.View`
  flex: 1;
`;
const WebView = styled.WebView``;

const KATALK_ASK_URL = 'https://jangbee-inpe21.firebaseapp.com/katalk_ask.html';

export default class KatalkAskWebview extends React.PureComponent {
  receiveWebViewMSG = async (webViewMSG) => {
    const webData = JSON.parse(webViewMSG);
    const postData = null;

    if (postData != null) {
      this.webView.postMessage(postData);
    }
  };

  render() {
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
              ref={(view) => {
                this.webView = view;
              }}
              source={{ uri: KATALK_ASK_URL }}
              style={{
                width: 380,
                height: 600,
                marginTop: 5,
                marginLeft: 5,
                marginRight: 5,
              }}
              onMessage={event => this.receiveWebViewMSG(event.nativeEvent.data)}
            />
          </Contents>
        </Modal>
      </Container>
    );
  }
}
