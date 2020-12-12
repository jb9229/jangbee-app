import * as SMS from 'expo-sms';

import { Alert, Modal, Share } from 'react-native';
import { convertHyphen, formatTelnumber } from 'utils/StringUtils';

import CloseButton from 'molecules/CloseButton';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import JBTextItem from 'molecules/JBTextItem';
import React from 'react';
import { formatNumber } from 'utils/NumberUtils';
import { shareClientEvalu } from 'src/container/firmHarmCase/searchAction';
import styled from 'styled-components/native';

const Container = styled.ScrollView`
  background-color: white;
  padding: 10px;
`;

const CommandWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40px;
`;

export default class ClientEvaluDetailModal extends React.Component
{
  constructor (props)
  {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps (nextProps)
  {
    const { detailEvalu } = nextProps;

    if (detailEvalu)
    {
      this.setState({ evalu: detailEvalu });
    }
  }

  noticeRegi = async () =>
  {
    const { closeModal } = this.props;
    const { evalu } = this.state;

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable)
    {
      const { result } = await SMS.sendSMSAsync(
        [evalu.regiTelNumber],
        `작성하신 [${formatTelnumber(
          evalu.telNumber
        )}] 불량 거래처에대해 행적을 신고 합니다.`
      );

      if (result)
      {
        closeModal();
      }
      else
      {
        Alert.alert(
          'SMS 전송불가',
          `해당 디바이스에서 SMS 자동 전송이 불가 합니다. [${
            evalu.regiTelNumber
          }] 해당 번호로 불량업체에 대한 행적을 알려주세요`
        );
      }
    }
    else
    {
      Alert.alert(
        'SMS 전송불가',
        `해당 디바이스에서 SMS 자동 전송이 불가 합니다. [${
          evalu.regiTelNumber
        }] 해당 번호로 불량업체에 대한 행적을 알려주세요`
      );
    }
  };

  shareClientEvalu = async () =>
  {
    const { closeModal, searchTime } = this.props;
    const { evalu } = this.state;

    try
    {
      const result = shareClientEvalu(evalu, searchTime);

      if (result.action === Share.sharedAction)
      {
        if (result.activityType)
        {
          // shared with activity type of result.activityType
          closeModal();
        }
        else
        {
          closeModal();
        }
      }
      else if (result.action === Share.dismissedAction)
      {
        // dismissed
        Alert.alert(Share.dismissedAction);
      }
    }
    catch (error)
    {
      Alert.alert(error.message);
    }
  };

  render ()
  {
    const { isVisibleModal, closeModal } = this.props;
    const { evalu } = this.state;

    if (!evalu)
    {
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
          <CloseButton onClose={() => closeModal()} />
          <JBTextItem
            title="전화번호"
            value={`${formatTelnumber(evalu.telNumber)}`}
            small
            row
          />
          {evalu.telNumber1 ? (
            <JBTextItem
              value={`${formatTelnumber(evalu.telNumber1)}`}
              small
              row
            />
          ) : null}
          {evalu.telNumber2 ? (
            <JBTextItem
              value={`${formatTelnumber(evalu.telNumber2)}`}
              small
              row
            />
          ) : null}
          <JBTextItem
            title="이름"
            value={convertHyphen(evalu.cliName)}
            small
            row
          />
          <JBTextItem
            title="업체명"
            value={convertHyphen(evalu.firmName)}
            small
            row
          />
          <JBTextItem
            title="장비"
            value={convertHyphen(evalu.equipment)}
            small
            row
          />
          <JBTextItem
            title="지역"
            value={convertHyphen(evalu.local)}
            small
            row
          />
          <JBTextItem
            title="금액"
            value={`${formatNumber(evalu.amount)} 원`}
            small
            row
          />
          <JBTextItem title="피해내용" value={evalu.reason} small />

          {evalu.regiTelNumber ? (
            <JBTextItem
              title="피해자 연락처"
              value={formatTelnumber(evalu.regiTelNumber)}
              small
              row
            />
          ) : null}

          <CommandWrap>
            {evalu.regiTelNumber ? (
              <JBButton
                title="작성자에게 행적신고"
                onPress={() => this.noticeRegi()}
              />
            ) : null}
            <JBButton
              title="공유하기"
              onPress={() => this.shareClientEvalu()}
              Primary
            />
          </CommandWrap>
        </Container>
      </Modal>
    );
  }
}
