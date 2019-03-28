import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import JBTextInput from './molecules/JBTextInput';
import JBErrorMessage from './organisms/JBErrorMessage';
import * as api from '../api/api';
import { validate } from '../utils/Validation';
import { notifyError } from '../common/ErrorNotice';

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

export default class ClientEvaluUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const { id, cliName, reason } = nextProps;

    if (cliName && reason) {
      this.setState({ id, cliName, reason });
    }
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal, completeAction } = this.props;

    const updateData = this.validateForm();

    api
      .updateClientEvaluation(updateData)
      .then((resBody) => {
        completeAction(resBody);
      })
      .catch(error => notifyError(
        '블랙리스트 업데이트 문제',
        `업데이트 요청에 문제가 있습니다, 다시 시도해 주세요(${error.message})`,
      ));

    closeModal();
  };

  /**
   * 유효성 검사 함수
   */
  validateForm = () => {
    const { id, cliName, reason } = this.state;

    // Validation Error Massage Initialize
    this.setState({
      cliNameValErrMessage: '',
      reasonValErrMessage: '',
    });

    let v = validate('textMax', cliName, true, 45);
    if (!v[0]) {
      this.setState({ cliNameValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', reason, true, 1000);
    if (!v[0]) {
      this.setState({ reasonValErrMessage: v[1] });
      return false;
    }

    const updateData = {
      id,
      cliName,
      reason,
    };

    return updateData;
  };

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const {
      cliName, reason, cliNameValErrMessage, reasonValErrMessage,
    } = this.state;

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
            <JBTextInput
              title="이름"
              value={cliName}
              onChangeText={text => this.setState({ cliName: text })}
              placeholder="블랙리스트명을 기입해 주세요"
            />
            <JBErrorMessage errorMSG={cliNameValErrMessage} />

            <JBTextInput
              title=""
              value={reason}
              onChangeText={text => this.setState({ reason: text })}
              placeholder="사유를 기입해 주세요"
            />
            <JBErrorMessage errorMSG={reasonValErrMessage} />

            <JBButton title="완료" onPress={() => this.completeAction()} />
          </ContentsView>
        </Container>
      </Modal>
    );
  }
}
