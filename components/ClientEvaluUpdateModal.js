import React from 'react';
import { KeyboardAvoidingView, Modal, ScrollView } from 'react-native';
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
    const {
      id, cliName, firmName, telNumber2, telNumber3, firmNumber, reason,
    } = nextProps;

    if (cliName && reason) {
      this.setState({
        id,
        cliName,
        firmName,
        telNumber2,
        telNumber3,
        firmNumber,
        reason,
      });
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
    const {
      id, cliName, firmName, telNumber2, telNumber3, firmNumber, reason,
    } = this.state;

    // Validation Error Massage Initialize
    this.setState({
      cliNameValErrMessage: '',
      firmNameValErrMessage: '',
      telNumber2ValErrMessage: '',
      telNumber3ValErrMessage: '',
      firmNumberValErrMessage: '',
      reasonValErrMessage: '',
    });

    let v = validate('textMax', cliName, true, 45);
    if (!v[0]) {
      this.setState({ cliNameValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', firmName, false, 12);
    if (!v[0]) {
      this.setState({ firmNameValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', telNumber2, false);
    if (!v[0]) {
      this.setState({ telNumber2ValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', telNumber3, false);
    if (!v[0]) {
      this.setState({ telNumber3ValErrMessage: v[1] });
      return false;
    }

    if (firmNumber && firmNumber.length !== 12) {
      this.setState({ firmNumberValErrMessage: '사업자번호가 유효하지 않습니다.' });
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
      firmName,
      telNumber2,
      telNumber3,
      firmNumber,
      reason,
    };

    return updateData;
  };

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const {
      cliName,
      firmName,
      telNumber2,
      telNumber3,
      firmNumber,
      reason,
      cliNameValErrMessage,
      firmNameValErrMessage,
      telNumber2ValErrMessage,
      telNumber3ValErrMessage,
      firmNumberValErrMessage,
      reasonValErrMessage,
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
          <KeyboardAvoidingView>
            <ScrollView>
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
                  title="업체명"
                  value={firmName}
                  onChangeText={text => this.setState({ firmName: text })}
                  placeholder="업체명을 기입해 주세요"
                />
                <JBErrorMessage errorMSG={firmNameValErrMessage} />

                <JBTextInput
                  title="전화번호2(숫자만)"
                  value={telNumber2}
                  onChangeText={text => this.setState({ telNumber2: text })}
                  placeholder="추가 전화번호를 기입해 주세요"
                  keyboardType="phone-pad"
                />
                <JBErrorMessage errorMSG={telNumber2ValErrMessage} />

                <JBTextInput
                  title="전화번호3(숫자만)"
                  value={telNumber3}
                  onChangeText={text => this.setState({ telNumber3: text })}
                  placeholder="추가 전화번호를 기입해 주세요"
                  keyboardType="phone-pad"
                />
                <JBErrorMessage errorMSG={telNumber3ValErrMessage} />

                <JBTextInput
                  title="사업자번호"
                  value={firmNumber}
                  onChangeText={text => this.setState({ firmNumber: text })}
                  placeholder="사업자번호를 기입해 주세요"
                />
                <JBErrorMessage errorMSG={firmNumberValErrMessage} />

                <JBTextInput
                  title="사유"
                  value={reason}
                  onChangeText={text => this.setState({ reason: text })}
                  placeholder="사유를 기입해 주세요(최대 1000자)"
                  numberOfLines={3}
                />
                <JBErrorMessage errorMSG={reasonValErrMessage} />

                <JBButton
                  title="수정"
                  onPress={() => this.completeAction()}
                  align="right"
                  Secondary
                />
              </ContentsView>
            </ScrollView>
          </KeyboardAvoidingView>
        </Container>
      </Modal>
    );
  }
}
