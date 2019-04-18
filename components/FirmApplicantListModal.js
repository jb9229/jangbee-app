import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import JBErrorMessage from './organisms/JBErrorMessage';
import FirmApplicantList from './organisms/FirmApplicantList';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  ${props => props.size === 'full'
    && `
    background-color: white;
  `}
`;

const ContentsView = styled.View`
  flex: 1;
  width: 100%;
  background-color: white;
  padding: 20px;
  ${props => props.size === 'full'
    && `
  `}
`;

export default class FirmApplicantListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal } = this.props;
    const { selectedFirm } = this.state;

    if (!selectedFirm) {
      this.setState({ submitErrMessage: '배창 요청할 업체를 선택해 주세요.' });
      return;
    }

    const newData = this.validateForm();

    closeModal();
  };

  /**
   * 유효성 검사 함수
   */
  validateForm = () => {
    const { selectedFirm } = this.state;

    // Validation Error Massage Initialize
    this.setState({
      submitErrMessage: '',
    });

    if (!selectedFirm) {
      this.setState({ submitErrMessage: '업체를 선정해 주세요.' });
      return false;
    }

    return selectedFirm;
  };

  render() {
    const {
      isVisibleModal, firmList, refreshing, handleRefresh, closeModal,
    } = this.props;
    const { submitErrMessage } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => {
          console.log('modal close');
        }}
      >
        <Container>
          <ContentsView>
            <JBIcon name="close" size={23} onPress={() => closeModal()} />
            <FirmApplicantList
              data={firmList}
              refreshing={refreshing}
              handleRefresh={handleRefresh}
              {...this.props}
            />
            <JBErrorMessage errorMSG={submitErrMessage} />

            <JBButton title="배차 요청하기" onPress={() => this.completeAction()} />
          </ContentsView>
        </Container>
      </Modal>
    );
  }
}
