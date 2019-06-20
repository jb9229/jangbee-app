import React from 'react';
import { Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import JBIcon from './molecules/JBIcon';
import Card from './molecules/CardUI';
import FirmSearList from './organisms/FirmSearList';
import JangbeeAdList from './JangbeeAdList';
import adLocation from '../constants/AdLocation';
import * as api from '../api/api';
import colors from '../constants/Colors';

const Container = styled.View`
  flex: 1;
  ${props => props.size === 'full'
    && `
    background-color: ${colors.batangLight};
  `}
`;

const TopWrap = styled.View`
`;

const SearchResultWrap = styled.View`
  flex: 1;
`;

export default class FirmSearListModal extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      searchedFirmList: null,
      page: 0,
      refreshing: false,
      isListLoading: undefined,
      isLastList: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.isVisibleModal) {
      this.setState({ page: 0 }, () => this.search(nextProps.isLocalSearch));
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  search = (isLocalSearch) => {
    if (isLocalSearch) {
      this.searchLocJangbee();
    } else {
      this.searchNearJangbee();
    }
  }

  /**
   * 주변 장비업체 검색 요청함수
   */
  searchNearJangbee = () => {
    const { searEquipment, searEquiModel, searLongitude, searLatitude } = this.props;
    const { searchedFirmList, page } = this.state;

    const searchStr = `${searEquiModel} ${searEquipment}`;

    api
      .getNearFirmList(page, searchStr, searLongitude, searLatitude)
      .then((res) => {
        if (!this._isMounted) {
          return;
        }

        this.setState({
          searchedFirmList: page === 0 ? res.content : [...searchedFirmList, ...res.content],
          isLastList: res.last,
          isListLoading: false,
          refreshing: false,
        });
      })
      .catch((error) => {
        if (!this._isMounted) {
          return;
        }

        Alert.alert(
          '주변 장비 조회에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
        this.setState({ isListLoading: false });
      });

    this.setState({isVisibleSearResultModal: true});
  };

  /**
   * 지역 장비업체 검색 함수
   */
  searchLocJangbee = () => {
    const { searEquipment, searEquiModel, searSido, searGungu } = this.props;
    const { page, searchedFirmList } = this.state;

    const searchStr = `${searEquiModel} ${searEquipment}`;

    let searGunguStr = searGungu;

    if (searGungu === '전체') { searGunguStr = ''; }

    api
      .getLocalFirmList(page, searchStr, searSido, searGunguStr)
      .then((res) => {
        if (!this._isMounted) {
          return;
        }

        this.setState({
          searchedFirmList: page === 0 ? res.content : [...searchedFirmList, ...res.content],
          isLastList: res.last,
          isListLoading: false,
          refreshing: false,
        });
      })
      .catch((error) => {
        if (!this._isMounted) {
          return;
        }

        Alert.alert(
          '주변 장비 조회에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
        this.setState({ isListLoading: false });
      });
  };

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal } = this.props;

    closeModal();
  };


  /**
   * 장비업체리스트 페이징 추가 함수
   */
  handleLoadMore = () => {
    const { page, isLastList } = this.state;

    if (isLastList) {
      return;
    }

    this.setState(
      {
        page: page + 1,
      },
      () => {
        this.searchNearJangbee();
      },
    );
  };

  /**
   * 장비업체리스트 새로고침 함수
   */
  handleRefresh = () => {
    const { isLocalSearch } = this.state;

    this.setState(
      {
        page: 0,
        refreshing: true,
      },
      () => {
        if (isLocalSearch) {
          this.search();
        } else {
          this.search();
        }
      },
    );
  };

  render() {
    const { isVisibleModal, closeModal, searEquipment, searSido, searGungu, size, navigation } = this.props;
    const { page, refreshing, searchedFirmList, isLastList, isListLoading } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <Container size={size}>
          <TopWrap>
            <JBIcon name="close" size={23} onPress={() => closeModal()} />
            <JangbeeAdList
              adLocation={adLocation.local}
              euqiTarget={searEquipment}
              sidoTarget={searSido}
              gugunTarget={searGungu}
              navigation={navigation}
            />
          </TopWrap>
          <Card>
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
          </Card>
        </Container>
      </Modal>
    );
  }
}
