import React from 'react';
import { FlatList, View } from 'react-native';
import FirmListItem from './FirmListItem';
import ListFooter from '../molecules/ListFooter';
import ListSeparator from '../molecules/ListSeparator';
import FirmDetailModal from '../FirmDetailModal';

export default class FirmSearList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisibleDetailModal: false,
    };
  }

  componentDidMount() {}

  /**
   * 검색된 장비업체리스트 렌더 함수
   *
   * @param {Object} itemOjb 리스트의 아이템 객체
   */
  renderListItem = ({ item }) => (
    <FirmListItem
      item={item}
      onPressItem={accountId => this.setState({ detailFirmId: accountId, isVisibleDetailModal: true })
      }
    />
  );

  render() {
    const {
      data,
      refreshing,
      last,
      loading,
      selEquipment,
      selSido,
      selGungu,
      handleRefresh,
      handleLoadMore,
    } = this.props;

    const { detailFirmId, isVisibleDetailModal } = this.state;
    return (
      <View>
        <FirmDetailModal
          isVisibleModal={isVisibleDetailModal}
          accountId={detailFirmId}
          closeModal={() => this.setState({ isVisibleDetailModal: false })}
        />
        <FlatList
          data={data}
          renderItem={this.renderListItem}
          ListFooterComponent={(
            <ListFooter
              hasMore={!last}
              isLoading={loading}
              selEquipment={selEquipment}
              selSido={selSido}
              selGungu={selGungu}
            />
)}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ListSeparator}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={10}
        />
      </View>
    );
  }
}
