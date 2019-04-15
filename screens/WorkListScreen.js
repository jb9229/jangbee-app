import React from 'react';
import {
  FlatList, StyleSheet, Text, View,
} from 'react-native';
import JBActIndicator from '../components/organisms/JBActIndicator';
import Item from '../components/organisms/JBListItem';
import ListSeparator from '../components/molecules/ListSeparator';
import JBButton from '../components/molecules/JBButton';

const styles = StyleSheet.create({});

export default class WorkListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isListEmpty: undefined,
      workList: [],
    };
  }

  componentDidMount() {
    // TODO did mount 후에는 setsate 안하게
    this.setListData();
  }

  /**
   * 리스트 데이터 설정함수
   */
  setListData = () => {
    this.setState({ isListEmpty: true });
  };

  /**
   * 리스트 아이템 렌더링 함수
   */
  renderItem = ({ item }) => <Item item={item} />;

  render() {
    const { navigation } = this.props;
    const { isListEmpty, workList } = this.state;

    if (isListEmpty === undefined) {
      return <JBActIndicator title="정보 불러오는중.." size={35} />;
    }

    if (isListEmpty) {
      return (
        <View style={styles.adEmptyViewWrap}>
          <View style={styles.emptyWordWrap}>
            <Text style={styles.emptyText}>+</Text>
            <Text style={styles.emptyText}>검색하고, 전화할 필요 없습니다.</Text>
            <Text style={styles.emptyText}>
              일감만 등록하면, 해당작업이 가능한 장비업체에서 전화가 옵니다.
            </Text>
          </View>
          <JBButton title="일감 등록하기" onPress={() => navigation.navigate('WorkRegister')} />
        </View>
      );
    }

    return (
      <View>
        <Text>일감 리스트 스크린</Text>

        <FlatList
          data={workList}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this.renderCliEvaluHeader}
          ItemSeparatorComponent={ListSeparator}
        />
      </View>
    );
  }
}
