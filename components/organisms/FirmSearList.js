import React from 'react';
import { Text, View, FlatList } from 'react-native';
import FirmListItem from './FirmListItem';
import ListFooter from '../molecules/ListFooter';

export default class FirmSearList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  /**
   * 검색된 장비업체리스트 렌더 함수
   *
   * @param {Object} itemOjb 리스트의 아이템 객체
   */
  renderListItem = (itemObj) => {
    const { navigation } = this.props;

    const props = {
      item: itemObj.item,
      onPressItem: id => navigation.navigate('FirmDetail', { accountId: id }),
    };
    return <FirmListItem data={props} />;
  };

  renderSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#CED0CE',
        marginLeft: '14%',
      }}
    />
  );

  render() {
    const {
      data, refreshing, last, loading, selEquipment, selSido, selGungu
    } = this.props;
    return (
      <View>
        <FlatList
          data={data}
          renderItem={this.renderListItem}
          ListFooterComponent={<ListFooter hasMore={!last} isLoading={loading} selEquipment={selEquipment} selSido={selSido} selGungu={selGungu} />}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.handleRefresh}
          refreshing={refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={10}
        />
      </View>
    );
  }
}
