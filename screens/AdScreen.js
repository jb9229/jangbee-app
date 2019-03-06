import React from 'react';
import {
  Alert, Button, FlatList, StyleSheet, TextInput, Text, View,
} from 'react-native';
import { withLogin } from '../contexts/LoginProvider';
import * as api from '../api/api';
import JBActIndicator from '../components/organisms/JBActIndicator';
import JangbeeAd from '../components/organisms/JangbeeAd';
import Card from '../components/molecules/CardUI';
import JBButton from '../components/molecules/JBButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class AdScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoadingAdList: true,
      isAdEmpty: true,
      adList: null,
    };
  }

  componentDidMount() {
    const { user } = this.props;

    this.setAdList(user.uid);
  }

  setAdList = (accountId) => {
    api
      .getJBAdList(accountId)
      .then((listData) => {
        if (listData.length > 0) {
          this.setState({ isAdEmpty: false, isLoadingAdList: false, adList: listData });
        } else {
          this.setState({ isAdEmpty: true, isLoadingAdList: false });
        }
      })
      .catch((error) => {
        Alert.alert(
          '업체정보 요청에 문제가 있습니다',
          `다시 시도해 주세요 -> [${error.name}] ${error.message}`,
        );

        this.setState({ isAdEmpty: true, isLoadingAdList: false });
      });
  };

  renderAdListItem = ({ item }) => (
    <Card>
      <JangbeeAd ad={item} />
    </Card>
  );

  render() {
    const { navigation } = this.props;
    const { isLoadingAdList, isAdEmpty, adList } = this.state;

    if (isLoadingAdList) {
      return <JBActIndicator title="내광고 로딩중.." size={35} />;
    }

    return (
      <View style={styles.container}>
        {!isAdEmpty ? (
          <FlatList
            data={adList}
            renderItem={this.renderAdListItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={this.renderSeparator}
          />
        ) : (
          <View>
            <Text>등록된 광고가 없습니다, 장비 홍보를해 주세요.</Text>
          </View>
        )}

        <View>
          <JBButton title="내장비 홍보하기(광고신청)" onPress={() => navigation.navigate('AdCreate')} size="full" />
        </View>
      </View>
    );
  }
}

export default withLogin(AdScreen);
