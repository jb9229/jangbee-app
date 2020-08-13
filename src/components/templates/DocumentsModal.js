import { Dimensions, Modal } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';

import CloseButton from 'molecules/CloseButton';
import ContracDocTabView from 'templates/ContractDocTabView';
import JBButton from 'molecules/JBButton';
import JangbeeAdList from 'organisms/JangbeeAdList';
import React from 'react';
import download from 'common/Download';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: white;
`;

const RouteContainer = styled.View`
  flex: 1;
  align-items: center;
  padding: 5px;
`;

const FirstRoute = () => (
  <RouteContainer>
    <JBButton
      title="건설기계임대차 표준계약서"
      onPress={() =>
        download(
          'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/doc/standard_contract.pdf',
          'abc.pdf'
        )
      }
      underline
    />
    <JBButton
      title="거래명세서"
      onPress={() =>
        download(
          'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/doc/%EA%B1%B0%EB%9E%98%EB%AA%85%EC%84%B8%EC%84%9C.hwp',
          'abc.pdf'
        )
      }
      underline
    />
    <JBButton
      title="크레인 견적서"
      onPress={() =>
        download(
          'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/doc/%ED%81%AC%EB%A0%88%EC%9D%B8_%EA%B2%AC%EC%A0%81%EC%84%9C.hwp',
          'abc.pdf'
        )
      }
      underline
    />
    <JBButton
      title="직불 동의서"
      onPress={() =>
        download(
          'https://elasticbeanstalk-ap-northeast-2-286936920557.s3.ap-northeast-2.amazonaws.com/download/payment_agree.jpeg',
          'payment_agree.jpeg'
        )
      }
      underline
    />
    <JBButton
      title="GL130"
      onPress={() =>
        download(
          'https://elasticbeanstalk-ap-northeast-2-286936920557.s3.ap-northeast-2.amazonaws.com/download/gr130nl.jpeg',
          'gr130nl.jpg'
        )
      }
      underline
    />
    <JBButton
      title="크레인 계약서"
      onPress={() =>
        download(
          'https://elasticbeanstalk-ap-northeast-2-286936920557.s3.ap-northeast-2.amazonaws.com/download/crain_contract.pdf',
          '크레인_계약서.pdf'
        )
      }
      underline
    />
    <JBButton
      title="LTM1055"
      onPress={() =>
        download(
          'https://elasticbeanstalk-ap-northeast-2-286936920557.s3.ap-northeast-2.amazonaws.com/download/LTM1055-1.pdf',
          'LTM1055-1.pdf'
        )
      }
      underline
    />
  </RouteContainer>
);

const SecondRoute = () => (
  <RouteContainer>
    <JBButton
      title="서보실업벨트 전화연결"
      onPress={() => download('tel: 0313344288')}
      underline
    />
    <JBButton
      title="대전출장빵구"
      onPress={() => download('tel: 01034683806')}
      underline
    />
    <JBButton
      title="비파괴검사기관"
      onPress={() => download('tel: 01033334707')}
      underline
    />
    <JBButton
      title="수산중공업"
      onPress={() => download('tel: 0313505277')}
      underline
    />
    <JBButton
      title="서울출장빵구"
      onPress={() => download('tel: 026884067')}
      underline
    />
    <JBButton
      title="비파괴검사기관(착한가격)"
      onPress={() => download('tel: 01089051331')}
      underline
    />
    <JBButton
      title="화산로프"
      onPress={() => download('tel: 0226773936')}
      underline
    />
  </RouteContainer>
);

const ThirdRoute = () => <ContracDocTabView />;

export default class DocumentsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: '계약 문서양식' },
        { key: 'second', title: '전화번호부' },
        { key: 'third', title: '제원표' }
      ],
      isVisibleImageModal: false
    };
  }

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const { isVisibleImageModal, visibleImage } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
        style={{flex: 1}}
      >
        <Container>
          <CloseButton onClose={() => closeModal()} align="flex-end" />
          <TabView
            navigationState={this.state}
            renderScene={SceneMap({
              first: FirstRoute,
              second: SecondRoute,
              third: ThirdRoute
            })}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get('window').width }}
          />
          <JangbeeAdList
            admob
            admobUnitID="ca-app-pub-9415708670922576/2729403292"
            admonSize="fullBanner"
            admonHeight="80"
          />
        </Container>
      </Modal>
    );
  }
}
