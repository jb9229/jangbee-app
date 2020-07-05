import * as api from 'api/api';

import { Alert, Modal } from 'react-native';

import Card from 'molecules/CardUI';
import CloseButton from 'molecules/CloseButton';
import FirmSearList from 'organisms/FirmSearList';
import JangbeeAdList from 'organisms/JangbeeAdList';
import React from 'react';
import adLocation from 'constants/AdLocation';
import colors from 'constants/Colors';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  ${props =>
    props.size === 'full' &&
    `
    background-color: ${colors.batangLight};
  `}
`;

const TopWrap = styled.View``;

const SearchResultWrap = styled.View`
  flex: 1;
`;

const CloseView = styled.View`
  position: absolute;
  top: 0;
  left: 0;
`;
const ItemWrapper = styled(Card).attrs(() => ({
  wrapperStyle: {
    flex: 1
  }
}))``;

export default class FirmSearListModal extends React.Component
{
  _isMounted = false;

  constructor (props)
  {
    super(props);
    this.state = {
      searchedFirmList: null,
      page: 0,
      refreshing: false,
      isListLoading: undefined,
      isLastList: false
    };
  }

  componentDidMount ()
  {
    this._isMounted = true;
  }

  componentWillReceiveProps (nextProps)
  {
    if (nextProps && nextProps.isVisibleModal)
    {
      this.setState({ page: 0 }, () => this.search(nextProps.isLocalSearch));
    }
  }

  componentWillUnmount ()
  {
    this._isMounted = false;
  }

  search = isLocalSearch =>
  {
    if (isLocalSearch)
    {
      this.searchLocJangbee();
    }
    else
    {
      this.searchNearJangbee();
    }
  };

  /**
   * 주변 장비업체 검색 요청함수
   */
  searchNearJangbee = () =>
  {
    const {
      searEquipment,
      searEquiModel,
      searLongitude,
      searLatitude
    } = this.props;
    const { searchedFirmList, page } = this.state;

    const searchStr = `${searEquiModel} ${searEquipment}`;

    api
      .getNearFirmList(page, searchStr, searLongitude, searLatitude)
      .then(res =>
      {
        if (!this._isMounted)
        {
          return;
        }

        this.setState({
          searchedFirmList:
            page === 0 ? res.content : [...searchedFirmList, ...res.content],
          isLastList: res.last,
          isListLoading: false,
          refreshing: false
        });
      })
      .catch(error =>
      {
        if (!this._isMounted)
        {
          return;
        }

        Alert.alert(
          '주변 장비 조회에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`
        );
        this.setState({ isListLoading: false });
      });

    this.setState({ isVisibleSearResultModal: true });
  };

  /**
   * 지역 장비업체 검색 함수
   */
  searchLocJangbee = () =>
  {
    const { searEquipment, searEquiModel, searSido, searGungu } = this.props;
    const { page, searchedFirmList } = this.state;

    const searchStr = `${searEquiModel} ${searEquipment}`;

    let searGunguStr = searGungu;

    if (searGungu === '전체')
    {
      searGunguStr = '';
    }

    api
      .getLocalFirmList(page, searchStr, searSido, searGunguStr)
      .then(res =>
      {
        if (!this._isMounted)
        {
          return;
        }

        this.setState({
          searchedFirmList:
            page === 0 ? res.content : [...searchedFirmList, ...res.content],
          isLastList: res.last,
          isListLoading: false,
          refreshing: false
        });
      })
      .catch(error =>
      {
        if (!this._isMounted)
        {
          return;
        }

        Alert.alert(
          '주변 장비 조회에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`
        );
        this.setState({ isListLoading: false });
      });
  };

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () =>
  {
    const { closeModal } = this.props;

    closeModal();
  };

  /**
   * 장비업체리스트 페이징 추가 함수
   */
  handleLoadMore = () =>
  {
    const { page, isLastList } = this.state;
    const { isLocalSearch } = this.props;

    if (isLastList)
    {
      return;
    }

    this.setState(
      {
        page: page + 1
      },
      () =>
      {
        this.search(isLocalSearch);
      }
    );
  };

  /**
   * 장비업체리스트 새로고침 함수
   */
  handleRefresh = () =>
  {
    const { isLocalSearch } = this.props;

    this.setState(
      {
        page: 0,
        refreshing: true
      },
      () =>
      {
        this.search(isLocalSearch);
      }
    );
  };

  render ()
  {
    const {
      isVisibleModal,
      closeModal,
      searEquipment,
      searEquiModel,
      searSido,
      searGungu,
      size,
      navigation
    } = this.props;
    const {
      page,
      refreshing,
      searchedFirmList,
      isLastList,
      isListLoading
    } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <Container size={size}>
          <TopWrap>
            <CloseView>
              <CloseButton onClose={() => closeModal()} />
            </CloseView>
            <JangbeeAdList
              adLocation={adLocation.local}
              euqiTarget={`${searEquiModel} ${searEquipment}`}
              sidoTarget={searSido}
              gugunTarget={searGungu}
              navigation={navigation}
            />
          </TopWrap>
          <ItemWrapper>
            <SearchResultWrap>
              <FirmSearList
                data={searchedFirmList}
                page={page}
                refreshing={refreshing}
                last={isLastList}
                isLoading={isListLoading}
                handleLoadMore={this.handleLoadMore}
                handleRefresh={this.handleRefresh}
                selEquipment={searEquipment}
                selSido={searSido}
                selGungu={searGungu}
                {...this.props}
              />
            </SearchResultWrap>
          </ItemWrapper>
        </Container>
      </Modal>
    );
  }
}
