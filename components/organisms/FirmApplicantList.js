import React from 'react';
import { FlatList } from 'react-native';
import AppliFirmItem from './AppliFirmItem';
import ListSeparator from '../molecules/ListSeparator';

export default class FirmApplicantList extends React.Component {
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
    return <AppliFirmItem data={props} />;
  };

  render() {
    const { data, refreshing, handleRefresh } = this.props;
    return (
      <FlatList
        data={data}
        renderItem={this.renderListItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ListSeparator}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    );
  }
}
