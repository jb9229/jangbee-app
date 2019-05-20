import React from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import * as api from '../api/api';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import JBTextInput from './molecules/JBTextInput';
import JBErrorMessage from './organisms/JBErrorMessage';
import { validate } from '../utils/Validation';
import { notifyError } from '../common/ErrorNotice';

const Container = styled.View`
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

export default class ClientEvaluCreateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = async () => {
    const { completeAction, closeModal } = this.props;

    const newEvaluation = await this.validateCreateForm();

    if (!newEvaluation) {
      return;
    }

    api
      .createClientEvaluation(newEvaluation)
      .then((resBody) => {
        completeAction(resBody);
        this.refreshEvaluValue();
        closeModal();
      })
      .catch(error => notifyError(error.error, error.message));
  };

  /**
   * 유효성검사 에러 메세지 초기화 함수
   */
  setInitValErroMSG = () => {
    this.setState({
      cliNameValErrMessage: '',
      firmNameValErrMessage: '',
      telNumberValErrMessage: '',
      telNumber2ValErrMessage: '',
      telNumber3ValErrMessage: '',
      firmNumberValErrMessage: '',
      equipmentValErrMessage: '',
      localValErrMessage: '',
      amountValErrMessage: '',
      regiTelNumberValErrMessage: '',
      reasonValErrMessage: '',
    });
  };

  refreshEvaluValue = () => {
    this.setState({
      cliName: '',
      firmName: '',
      telNumber: '',
      telNumber2: '',
      telNumber3: '',
      firmNumber: '',
      equipment: '',
      local: '',
      amount: '',
      regiTelNumber: '',
      reason: '',
    });
  };

  /**
   * 블랙리스트 추가 유효성 검사 함수
   */
  validateCreateForm = async () => {
    const {
      cliName,
      firmName,
      telNumber,
      telNumber2,
      telNumber3,
      firmNumber,
      equipment,
      local,
      amount,
      regiTelNumber,
      reason,
    } = this.state;
    const { accountId } = this.props;

    // Validation Error Massage Initialize
    this.setInitValErroMSG();

    if (!accountId) {
      Alert.alert('유효성검사 에러', '사용자정보를 찾지 못했습니다, 재로그인해 주세요');
      return false;
    }

    let v = validate('textMax', cliName, false, 8);
    if (!v[0]) {
      this.setState({ cliNameValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', firmName, false, 12);
    if (!v[0]) {
      this.setState({ firmNameValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', telNumber, true);
    if (!v[0]) {
      this.setState({ telNumberValErrMessage: v[1] });
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

    if (firmNumber && (firmNumber.length !== 12 && firmNumber.length !== 10)) {
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

    const telDuplResult = await api
      .existClinetEvaluTelnumber(telNumber)
      .then((resBody) => {
        if (resBody) {
          Alert.alert(
            '전화번호가 이미 존재함',
            '등록하려는 블랙리스트 전화번호가 존재 합니다, 블랙리스트에서 검색 후 확인 해 주세요',
          );
          return false;
        }
        return true;
      })
      .catch((error) => {
        notifyError(
          '블랙리스트 전화번호 중복체크 문제',
          `중복체크에 실패 했습니다, 다시 시도해 주세요, ${error.message}`,
        );
        return false;
      });

    if (telDuplResult) {
      const newEvaluData = {
        accountId,
        cliName,
        firmName,
        telNumber,
        telNumber2,
        telNumber3,
        firmNumber,
        equipment,
        local,
        amount,
        regiTelNumber,
        reason,
      };

      if (!newEvaluData.firmNumber) {
        delete newEvaluData.firmNumber;
      }

      return newEvaluData;
    }

    return false;
  };

  render() {
    const { isVisibleModal, closeModal, size } = this.props;
    const {
      cliName,
      firmName,
      telNumber,
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
      telNumberValErrMessage,
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
        <Container size={size}>
          <KeyboardAvoidingView>
            <ScrollView>
              <ContentsView size={size}>
                <JBIcon name="close" size={23} onPress={() => closeModal()} />

                <JBTextInput
                  title="전화번호(숫자만)*"
                  value={telNumber}
                  onChangeText={text => this.setState({ telNumber: text })}
                  placeholder="블랙리스트 전화번호를 기입해 주세요"
                  keyboardType="phone-pad"
                />
                <JBErrorMessage errorMSG={telNumberValErrMessage} />

                <JBTextInput
                  title="고객명"
                  value={cliName}
                  onChangeText={text => this.setState({ cliName: text })}
                  placeholder="고객명을 기입해 주세요"
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
                  keyboardType="numeric"
                />
                <JBErrorMessage errorMSG={amountValErrMessage} />

                <JBTextInput
                  title="작성자 연락처"
                  value={regiTelNumber}
                  onChangeText={text => this.setState({ regiTelNumber: text })}
                  placeholder="타업체가 행적을 신고해 줄 수 있습니다."
                  keyboardType="phone-pad"
                />
                <JBErrorMessage errorMSG={regiTelNumberValErrMessage} />

                <JBTextInput
                  title="사유*"
                  value={reason}
                  onChangeText={text => this.setState({ reason: text })}
                  placeholder="블랙리스트 사유를 기입해 주세요"
                  numberOfLines={5}
                  multiline
                />
                <JBErrorMessage errorMSG={reasonValErrMessage} />

                <JBButton
                  title="피해사례 추가하기"
                  onPress={() => this.completeAction()}
                  size="full"
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
