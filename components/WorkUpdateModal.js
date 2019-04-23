import React from 'react';
import { Alert, BackHandler, Modal } from 'react-native';
import styled from 'styled-components/native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
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

export default class WorkUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editWork) {
      this.setState({
        workId: nextProps.editWork.id,
        phoneNumber: nextProps.editWork.phoneNumber,
        detailRequest: nextProps.editWork.detailRequest,
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { closeModal } = this.props;

    closeModal(); // works best when the goBack is async
    return true;
  };

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal, completeAction } = this.props;

    const updateData = this.validateForm();
    if (!updateData) {
      return;
    }

    completeAction(updateData);

    closeModal();
  };

  /**
   * 유효성 검사 함수
   */
  validateForm = () => {
    const { workId, phoneNumber, detailRequest } = this.state;

    // Validation Error Massage Initialize
    this.setState({
      phoneNumberValErrMessage: '',
      detailRequestValErrMessage: '',
    });

    if (!workId) {
      Alert.alert(
        '유효하지 않은 일감정보',
        '수정하려는 일감정보가 유효하지 않습니다, 일감 리스트를 새로고침 후 다시 시도해 주세요',
      );
      return false;
    }

    let v = validate('cellPhone', phoneNumber, true);
    if (!v[0]) {
      this.setState({ phoneNumberValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', detailRequest, true, 500);
    if (!v[0]) {
      this.setState({ detailRequestValErrMessage: v[1] });
      return false;
    }

    const updateData = {
      workId,
      phoneNumber,
      detailRequest,
    };
    return updateData;
  };

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const {
      phoneNumber,
      detailRequest,
      phoneNumberValErrMessage,
      detailRequestValErrMessage,
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
              title="전화번호"
              value={phoneNumber}
              onChangeText={text => this.setState({ phoneNumber: text })}
              placeholder="전화번호를 기입해 주세요"
            />
            <JBErrorMessage errorMSG={phoneNumberValErrMessage} />

            <JBTextInput
              title="작업 세부사항"
              value={detailRequest}
              onChangeText={text => this.setState({ detailRequest: text })}
              placeholder="작업 세부사항 및 요청사항을 입력하세요."
              multiline
              numberOfLines={3}
            />
            <JBErrorMessage errorMSG={detailRequestValErrMessage} />

            <JBButton title="일감수정 완료" onPress={() => this.completeAction()} />
          </ContentsView>
        </Container>
      </Modal>
    );
  }
}
