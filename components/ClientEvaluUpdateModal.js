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
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const { updateEvalu } = nextProps;

    if (updateEvalu) {
      this.setState({
        id: updateEvalu.id,
        cliName: updateEvalu.cliName,
        firmName: updateEvalu.firmName,
        telNumber2: updateEvalu.telNumber2,
        telNumber3: updateEvalu.telNumber3,
        firmNumber: updateEvalu.firmNumber,
        equipment: updateEvalu.equipment,
        local: updateEvalu.local,
        amount: updateEvalu.amount,
        regiTelNumber: updateEvalu.regiTelNumber,
        reason: updateEvalu.reason,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal, completeAction } = this.props;

    const updateData = this.validateForm();

    if (!updateData) {
      return;
    }

    api
      .updateClientEvaluation(updateData)
      .then((resBody) => {
        if (!this._isMounted) {
          return;
        }

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
      id,
      cliName,
      firmName,
      telNumber2,
      telNumber3,
      firmNumber,
      equipment,
      local,
      amount,
      regiTelNumber,
      reason,
    } = this.state;

    // Validation Error Massage Initialize
    this.setState({
      cliNameValErrMessage: '',
      firmNameValErrMessage: '',
      telNumber2ValErrMessage: '',
      telNumber3ValErrMessage: '',
      firmNumberValErrMessage: '',
      equipmentValErrMessage: '',
      localValErrMessage: '',
      amountValErrMessage: '',
      regiTelNumberValErrMessage: '',
      reasonValErrMessage: '',
    });

    let v = validate('textMax', cliName, false, 45);
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

    v = validate('textMax', equipment, false, 45);
    if (!v[0]) {
      this.setState({ equipmentValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', local, false, 45);
    if (!v[0]) {
      this.setState({ localValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', amount, false, 45);
    if (!v[0]) {
      this.setState({ amountValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', regiTelNumber, false);
    if (!v[0]) {
      this.setState({ regiTelNumberValErrMessage: v[1] });
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
      equipment,
      local,
      amount,
      regiTelNumber,
      reason,
    };
    console.log(updateData);
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
      equipment,
      local,
      amount,
      regiTelNumber,
      reason,
      cliNameValErrMessage,
      firmNameValErrMessage,
      telNumber2ValErrMessage,
      telNumber3ValErrMessage,
      firmNumberValErrMessage,
      equipmentValErrMessage,
      localValErrMessage,
      amountValErrMessage,
      regiTelNumberValErrMessage,
      reasonValErrMessage,
    } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
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
                  title="장비"
                  value={equipment}
                  onChangeText={text => this.setState({ equipment: text })}
                  placeholder="어떤 장비의 피해사례 입니까?"
                />
                <JBErrorMessage errorMSG={equipmentValErrMessage} />

                <JBTextInput
                  title="지역"
                  value={local}
                  onChangeText={text => this.setState({ local: text })}
                  placeholder="어떤 지역의 피해사례 입니까?"
                />
                <JBErrorMessage errorMSG={localValErrMessage} />

                <JBTextInput
                  title="금액"
                  value={amount}
                  onChangeText={text => this.setState({ amount: text })}
                  placeholder="피해금액이 얼마입니까?"
                />
                <JBErrorMessage errorMSG={amountValErrMessage} />

                <JBTextInput
                  title="작성자 전화번호"
                  value={regiTelNumber}
                  onChangeText={text => this.setState({ regiTelNumber: text })}
                  placeholder="행적을 신고해 줄 수 있습니다."
                />
                <JBErrorMessage errorMSG={regiTelNumberValErrMessage} />

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
