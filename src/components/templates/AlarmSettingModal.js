import React from 'react';
import { Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import JBButton from 'molecules/JBButton';
import CloseButton from 'molecules/CloseButton';
import CallDetection from 'native_modules/CallDetection';
import SettingList from 'organisms/SettingList';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  margin-top: 15%;
  margin-bottom: 30%;
  margin-left: 5%;
  margin-right: 5%;
  ${props =>
    props.size === 'full' &&
    `
    background-color: white;
  `}
`;

const ContentsView = styled.View`
  flex: 1;
  justify-content: space-around;
  background-color: white;
  padding: 3%;
  ${props =>
    props.size === 'full' &&
    `
  `}
`;

const SettingWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const SettingText = styled.Text``;

const BLScanSwitch = styled.Switch``;

export default class AlarmSettingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const { isVisibleModal } = nextProps;

    if (isVisibleModal) {
      this.checkBLScanServiceRunning();
    }
  }

  checkBLScanServiceRunning = () => {
    const { closeModal } = this.props;

    CallDetection.isRunningService(
      isRunning => {
        this.setState({ blCallScanSwitch: isRunning });
      },
      errorMsg => {
        Alert.alert('수신전화 피해사례조회 권한 설정 필요', `${errorMsg}`);

        closeModal();
      }
    );
  };

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal } = this.props;

    closeModal();
  };

  /**
   * Switching Black List Imcomming Calling Scan
   */
  switchBLCallScan = () => {
    const { blCallScanSwitch } = this.state;

    if (!blCallScanSwitch) {
      CallDetection.start(
        startResult => {
          this.setState({ blCallScanSwitch: startResult });
        },
        errorMsg => {
          Alert.alert(
            '수신전화 피해사례조회 서비스 시작 실패',
            `요청에 문제가 발생했습니다, 다시 시작해 주세요: ${errorMsg}`
          );
        }
      );
    } else {
      CallDetection.finish(
        stopResult => {
          this.setState({ blCallScanSwitch: stopResult });
        },
        errorMsg => {
          Alert.alert(
            '수신전화 피해사례조회 서비스 종료 실패',
            `요청에 문제가 발생했습니다, 다시 종료해 주세요: ${errorMsg}`
          );
        }
      );
    }
  };

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const { blCallScanSwitch } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <Container size="full">
          <ContentsView>
            <CloseButton onClose={() => closeModal()} />
            <SettingList
              data={[
                {
                  title: '알람설정',
                  data: [
                    {
                      switchOn: blCallScanSwitch,
                      text: '피해사례조회',
                      switchAction: this.switchBLCallScan
                    }
                  ]
                }
              ]}
            />
            <JBButton
              title="완료"
              onPress={() => this.completeAction()}
              align="right"
            />
          </ContentsView>
        </Container>
      </Modal>
    );
  }
}
