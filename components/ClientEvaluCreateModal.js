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
    this.state = {
      cliName: '',
      firmName: '',
      telNumber: '',
      telNumber2: '',
      telNumber3: '',
      firmNumber: '',
      reason: '',
      isDuplTelNChecked: undefined,
      cliNameValErrMessage: '',
      firmNameValErrMessage: '',
      telNumberValErrMessage: '',
      telNumber2ValErrMessage: '',
      telNumber3ValErrMessage: '',
      firmNumberValErrMessage: '',
      reasonValErrMessage: '',
    };
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
        closeModal();
      })
      .catch(ex => notifyError('블랙리스트 추가 실패', ex.message));
  };

  /**
   * 유효성검사 에러 메세지 초기화 함수
   */
  setInitValErroMSG = () => {
    this.setState({
      cliNameValErrMessage: '',
      firmNameValErrMessage: '',
      firmNumberValErrMessage: '',
      telNumberValErrMessage: '',
      telNumber2ValErrMessage: '',
      telNumber3ValErrMessage: '',
      reasonValErrMessage: '',
    });
  };

  /**
   * 블랙리스트 추가 유효성 검사 함수
   */
  validateCreateForm = async () => {
    const {
      cliName, firmName, telNumber, telNumber2, telNumber3, firmNumber, reason,
    } = this.state;
    const { accountId } = this.props;

    // Validation Error Massage Initialize
    this.setInitValErroMSG();

    if (!accountId) {
      Alert.alert('유효성검사 에러', '사용자정보를 찾지 못했습니다, 재로그인해 주세요');
      return false;
    }

    let v = validate('textMax', cliName, true, 8);
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

    if (firmNumber !== '' && firmNumber.length !== 12) {
      this.setState({ firmNumberValErrMessage: '사업자번호가 유효하지 않습니다.' });
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
        reason,
      };

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
      reason,
      cliNameValErrMessage,
      firmNameValErrMessage,
      telNumberValErrMessage,
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
        <Container size={size}>
          <KeyboardAvoidingView>
            <ScrollView>
              <ContentsView size={size}>
                <JBIcon name="close" size={23} onPress={() => closeModal()} />
                <JBTextInput
                  title="고객명*"
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
                  title="전화번호(숫자만)*"
                  value={telNumber}
                  onChangeText={text => this.setState({ telNumber: text })}
                  placeholder="블랙리스트 전화번호를 기입해 주세요"
                  keyboardType="phone-pad"
                />
                <JBErrorMessage errorMSG={telNumberValErrMessage} />

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
                  placeholder="블랙리스트 사유를 기입해 주세요"
                  numberOfLines={5}
                />
                <JBErrorMessage errorMSG={reasonValErrMessage} />

                <JBButton
                  title="블랙리스트 추가하기"
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
