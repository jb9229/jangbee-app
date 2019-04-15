import React from 'react';
import {
  AsyncStorage, FlatList, Text, View,
} from 'react-native';
import JBActIndicator from '../components/organisms/JBActIndicator';
import Item from '../components/organisms/JBListItem';
import ListSeparator from '../components/molecules/ListSeparator';

const DefaultFavEquipment = '크레인';
const FavoriteEquipmentStorKey = 'FAVORITEWORKLISTEQUIPMENT';

export default class FirmWorkListScreen extends React.Component {
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
  setListData = (equipment) => {
    this.setState({ isListEmpty: true });
  };

  storeFavEquipment = async (favEquipment) => {
    try {
      await AsyncStorage.setItem(FavoriteEquipmentStorKey, favEquipment);
    } catch (error) {
      // Error saving data
    }
  };

  retrieveFavEquipment = async () => {
    try {
      const value = await AsyncStorage.getItem(FavoriteEquipmentStorKey);
      if (value !== null) {
        this.setListData(value);
      }
    } catch (error) {
      this.setListData(DefaultFavEquipment);
    }
  };

  /**
   * 리스트 아이템 렌더링 함수
   */
  renderItem = ({ item }) => <Item item={item} />;

  render() {
    const { isListEmpty, workList } = this.state;

    if (isListEmpty === undefined) {
      return <JBActIndicator title="정보 불러오는중.." size={35} />;
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
