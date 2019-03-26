import React from 'react';
import { Modal, Text } from 'react-native';
import styled from 'styled-components/native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';

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
  background-color: white;
  padding: 20px;
  ${props => props.size === 'full'
    && `
  `}
`;

export default class ModalTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal } = this.props;

    closeModal();
  };

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const {} = this.state;

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
            <Text>모달 떴다</Text>

            <JBButton title="완료" onPress={() => this.completeAction()} />
          </ContentsView>
        </Container>
      </Modal>
    );
  }
}
