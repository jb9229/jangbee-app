import * as api from 'api/api';

import AppliFirmItem from 'organisms/AppliFirmItem';
import FirmDetailModal from 'templates/FirmDetailModal';
import { FlatList } from 'react-native';
import JBButton from 'molecules/JBButton';
import JBErrorMessage from 'organisms/JBErrorMessage';
import ListSeparator from 'molecules/ListSeparator';
import React from 'react';
import { notifyError } from 'common/ErrorNotice';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  ${props =>
    props.size === 'full' &&
    `
    background-color: white;
  `}
`;

const ContentsView = styled.View`
  flex: 1;
  width: 100%;
  background-color: white;
  padding: 20px;
  ${props =>
    props.size === 'full' &&
    `
  `}
`;

export default class AppliFirmList extends React.Component
{
  constructor (props)
  {
    super(props);
    this.state = {
      isVisibleDetailModal: false,
      selectedFirmAccId: undefined,
      refreshing: false,
      firmList: []
    };
  }

  componentDidMount ()
  {
    const workId = this.props.navigation.getParam('workId', undefined);

    this.setState({ appliWorkId: workId }, () => this.setAppliFirmList());
  }

  /**
   * 업체선정 설정함수
   */
  setAppliFirmList = () =>
  {
    const { appliWorkId } = this.state;

    if (!appliWorkId)
    {
      this.setState({
        submitErrMessage: `[${appliWorkId}] 잘못된 일감 아이디 입니다.`
      });
      return;
    }

    api
      .getAppliFirmList(appliWorkId)
      .then(resBody =>
      {
        if (resBody)
        {
          this.setState({ firmList: resBody, refreshing: false });
        }

        this.setState({ refreshing: false });
      })
      .catch(error => notifyError(error.name, error.message));
  };

  /**
   * 모달 액션 완료 함수
   */
  requestDispatchFirm = () =>
  {
    const { navigation } = this.props;
    const selectedData = this.validateForm();

    if (selectedData)
    {
      api
        .selectAppliFirm(selectedData)
        .then(result =>
        {
          if (result)
          {
            navigation.navigate('WorkList', { refresh: true });
          }
        })
        .catch(error => notifyError(error.name, error.message));
    }
  };

  /**
   * 유효성 검사 함수
   */
  validateForm = () =>
  {
    const { selectedFirmAccId } = this.state;
    const workId = this.props.navigation.getParam('workId', undefined);

    // Validation Error Massage Initialize
    this.setState({
      submitErrMessage: ''
    });

    if (!selectedFirmAccId)
    {
      this.setState({ submitErrMessage: '업체를 선정해 주세요.' });
      return false;
    }

    const selectedData = {
      accountId: selectedFirmAccId,
      workId
    };

    return selectedData;
  };

  /**
   * 검색된 장비업체리스트 렌더 함수
   *
   * @param {Object} itemOjb 리스트의 아이템 객체
   */
  renderListItem = ({ item }) =>
  {
    const { navigation } = this.props;
    const { selectedFirmAccId } = this.state;

    return (
      <AppliFirmItem
        item={item}
        onPressItem={id =>
          this.setState({ isVisibleDetailModal: true, selectedFirmAccId: id })
        }
        selectFirm={accountId =>
          this.setState({ selectedFirmAccId: accountId })
        }
        selected={item.accountId === selectedFirmAccId}
      />
    );
  };

  render ()
  {
    const {
      isVisibleDetailModal,
      refreshing,
      selectedFirmAccId,
      firmList,
      submitErrMessage
    } = this.state;

    return (
      <Container>
        <FirmDetailModal
          isVisibleModal={isVisibleDetailModal}
          accountId={selectedFirmAccId}
          closeModal={() => this.setState({ isVisibleDetailModal: false })}
          hideCallButton
        />
        <ContentsView>
          <FlatList
            data={firmList}
            extraData={selectedFirmAccId}
            renderItem={this.renderListItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ListSeparator}
            onRefresh={() =>
              this.setState({ refreshing: true }, () => this.setAppliFirmList())
            }
            refreshing={refreshing}
          />
          <JBErrorMessage errorMSG={submitErrMessage} />

          <JBButton
            title="배차 요청하기"
            onPress={() => this.requestDispatchFirm()}
            size="full"
            Secondary
          />
        </ContentsView>
      </Container>
    );
  }
}
