import React from 'react';
import { Dimensions, Modal } from 'react-native';
import styled from 'styled-components/native';
import { TabView, SceneMap } from 'react-native-tab-view';
import download from '../common/Download';
import ContracDocTabView from './ContractDocTabView';
import JBButton from './molecules/JBButton';
import CloseButton from './molecules/CloseButton';

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
      onPress={() => download(
        'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/doc/standard_contract.pdf',
        'abc.pdf',
      )
      }
      underline
    />
  </RouteContainer>
);

const SecondRoute = () => (
  <RouteContainer>
    <JBButton title="서보실업벨트 전화연결" onPress={() => download('tel: 0313344288')} underline />
  </RouteContainer>
);

const ThirdRoute = () => (<ContracDocTabView />);

export default class DocumentsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: '계약 문서양식' },
        { key: 'second', title: '전화번호부' },
        { key: 'third', title: '제원표' },
      ],
      isVisibleImageModal: false,
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
      >
        <Container>
          <CloseButton onClose={() => closeModal()} align="flex-end" />
          <TabView
            navigationState={this.state}
            renderScene={SceneMap({
              first: FirstRoute,
              second: SecondRoute,
              third: ThirdRoute,
            })}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get('window').width }}
          />
        </Container>
      </Modal>
    );
  }
}
