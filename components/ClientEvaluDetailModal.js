import React from 'react';
import { Alert, Modal, Share } from 'react-native';
import { SMS } from 'expo';
import styled from 'styled-components/native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import JBTextItem from './molecules/JBTextItem';
import JBActIndicator from './organisms/JBActIndicator';
import { convertHyphen, formatTelnumber } from '../utils/StringUtils';

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

const ContentsWrap = styled.View`
  flex: 1;
  width: 100%;
  background-color: white;
  padding: 20px;
  ${props => props.size === 'full'
    && `
  `}
`;

const CommandWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

export default class ClientEvaluDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const { detailEvalu } = nextProps;

    if (detailEvalu) {
      this.setState({ evalu: detailEvalu });
    }
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal } = this.props;

    closeModal();
  };

  noticeRegi = async () => {
    const { evalu } = this.state;

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        [evalu.regiTelNumber],
        `작성하신 [${formatTelnumber(evalu.telNumber)}] 불량 거래처에대해 행적을 신고 합니다.`,
      );
    } else {
      Alert.alert(
        'SMS 전송불가',
        `해당 디바이스에서 SMS 자동 전송이 불가 합니다. [${
          evalu.regiTelNumber
        }] 해당 번호로 알려주세요`,
      );
    }
  };

  shareClientEvalu = async () => {
    const { closeModal } = this.props;
    const { evalu } = this.state;

    try {
      const result = await Share.share({
        message: `[건설장비 피해사례 공유]\n\n전화번호: ${formatTelnumber(
          evalu.telNumber,
        )}${this.makeShareContent('이름', evalu.cliName)}${this.makeShareContent(
          '업체명',
          evalu.firmName,
        )}${this.makeShareContent('전화번호2', evalu.telNumber2)}${this.makeShareContent(
          '전화번호3',
          evalu.telNumber3,
        )}${this.makeShareContent('사업자번호', evalu.firmNumber)}${this.makeShareContent(
          '장비',
          evalu.equipment,
        )}${this.makeShareContent('지역', evalu.local)}${this.makeSharePriceContent(
          '금액',
          evalu.amount,
        )}${this.makeShareContent(
          '피해내용',
          evalu.reason,
        )}\n\n자세한 내용은 장비콜 앱에서 확인해 주세요.https://play.google.com/store/apps/details?id=com.kan.jangbeecall`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          closeModal();
        } else {
          closeModal();
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  makeShareContent = (title, content) => {
    if (content) {
      return `\n${title}: ${content}`;
    }

    return '';
  };

  makeSharePriceContent = (title, content) => {
    if (content) {
      return `\n${title}: ${content} 원`;
    }

    return '';
  };

  render() {
    const { isVisibleModal, closeModal } = this.props;
    const { evalu } = this.state;

    if (!evalu) {
      return (
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <Container>
            <JBActIndicator />
          </Container>
        </Modal>
      );
    }

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <Container>
          <ContentsWrap>
            <JBIcon name="close" size={23} onPress={() => closeModal()} />

            <JBTextItem title="전화번호" value={formatTelnumber(evalu.telNumber)} small row />
            <JBTextItem title="전화번호2" value={formatTelnumber(evalu.telNumber2)} small row />
            <JBTextItem title="전화번호3" value={formatTelnumber(evalu.telNumber3)} small row />

            {evalu.regiTelNumber && (
              <JBTextItem
                title="작성자 번호"
                value={formatTelnumber(evalu.regiTelNumber)}
                small
                row
              />
            )}
            <JBTextItem title="이름" value={convertHyphen(evalu.cliName)} small row />
            <JBTextItem title="업체명" value={convertHyphen(evalu.firmName)} small row />
            <JBTextItem title="장비" value={convertHyphen(evalu.equipment)} small row />
            <JBTextItem title="지역" value={convertHyphen(evalu.local)} small row />
            <JBTextItem title="금액" value={`${convertHyphen(evalu.amount)} 원`} small row />
            <JBTextItem title="피해내용" value={evalu.reason} small />

            <CommandWrap>
              {evalu.regiTelNumber && (
                <JBButton title="작성자에게 행적신고" onPress={() => this.noticeRegi()} />
              )}
              <JBButton title="공유하기" onPress={() => this.shareClientEvalu()} Primary />
            </CommandWrap>
          </ContentsWrap>
        </Container>
      </Modal>
    );
  }
}
