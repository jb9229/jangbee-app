import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import FirmListItem from './FirmListItem';
import ListFooter from '../molecules/ListFooter';
import colors from '../../constants/Colors';

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.pointDark,
    marginLeft: 3,
    marginRight: 3,
  },
});
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

  renderSeparator = () => <View style={styles.separator} />;

  render() {
    const {
      data, refreshing, last, loading, selEquipment, selSido, selGungu,
    } = this.props;
    return (
      <View>
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
