import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import CloseButton from './molecules/CloseButton';
import JBTextInput from './molecules/JBTextInput';
import JBErrorMessage from './organisms/JBErrorMessage';
import { validate } from '../utils/Validation';

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

  componentWillReceiveProps(nextProps) {
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal } = this.props;

    const newData = this.validateForm();

    closeModal();
  };

  /**
   * 유효성 검사 함수
   */
  validateForm = () => {
    const {} = this.state;
  
    // Validation Error Massage Initialize
    this.setState({
      ?ValErrMessage: '',
    });
    
    let v = validate('textMax', ?, true, 45);
    if (!v[0]) {
      this.setState({ ?ValErrMessage: v[1] });
      return false;
    }

  }

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const {} = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <Container>
          <ContentsView>
            <CloseButton onClose={() => closeModal()} />
            <JBTextInput
              title=""
              value={?}
              onChangeText={text => this.setState({ ?: text })}
              placeholder="기입해 주세요"
            />
            <JBErrorMessage errorMSG={?ValErrMessage} />

            <JBButton title="완료" onPress={() => this.completeAction()} />
          </ContentsView>
        </Container>
      </Modal>
    );
  }
}
