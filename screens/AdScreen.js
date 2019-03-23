import React from 'react';
import {
  Alert, FlatList, StyleSheet, Text, View,
} from 'react-native';
import { withLogin } from '../contexts/LoginProvider';
import * as api from '../api/api';
import JBActIndicator from '../components/organisms/JBActIndicator';
import JangbeeAd from '../components/organisms/JangbeeAd';
import Card from '../components/molecules/CardUI';
import JBButton from '../components/molecules/JBButton';
import { getAdtypeStr } from '../constants/AdTypeStr';
import AdUpdateModal from '../components/AdUpdateModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adListItemWrap: {
    flex: 1,
  },
  adListCommWrap: {
    flex: 1,
    flexDirection: 'row',
  },
  adListLeftWrap: {
    flex: 3,
  },
  adListRightWrap: {
    flex: 1,
  },
  adListDateWrap: {
    flexDirection: 'row',
  },
  adListTargetLocalWrap: {
    flexDirection: 'row',
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
      isVisibleAdUpdateModal: false,
      adList: null,
    };
  }

  componentDidMount() {
    this.setAdList();
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.navigation.state;

    if (params !== undefined && params.refresh !== undefined) {
      this.setAdList();
    }
  }

  setAdList = () => {
    const { user } = this.props;
    api
      .getJBAdList(user.uid)
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

  /**
   * 광고업데이트 요청 함수
   */
  updateAd = (item) => {
    this.setState({ isVisibleAdUpdateModal: true });

    this.setState({upAdId: item.id, upAdTitle: item.title, upAdSubTitle: item.subTitle, upAdPhotoUrl: item.photoUrl, upAdTelNumber: item.telNumber});
  };

  renderAdListItem = ({ item }) => (
    <Card>
      <View style={styles.adListItemWrap}>
        <JangbeeAd ad={item} />
        <View style={styles.adListCommWrap}>
          <View style={styles.adListLeftWrap}>
            <Text>{getAdtypeStr(item.adType)}</Text>
            <Text>{item.equiTarget}</Text>
            <View style={styles.adListTargetLocalWrap}>
              <Text>{item.sidoTarget}</Text>
              <Text>{item.gugunTarget}</Text>
            </View>
            <View style={styles.adListDateWrap}>
              <Text>{item.startDate}</Text>
              <Text>~</Text>
              <Text>{item.endDate}</Text>
            </View>
          </View>
          <View style={styles.adListRightWrap}>
            <JBButton title="수정" onPress={() => this.updateAd(item)} size="small" underline />
            <JBButton title="해지" onPress={() => this.terminateAd()} size="small" underline />
          </View>
        </View>
      </View>
    </Card>
  );

  render() {
    const { navigation } = this.props;
    const {
      isLoadingAdList, isAdEmpty, adList, isVisibleAdUpdateModal,
      upAdId, upAdTitle, upAdSubTitle, upAdPhotoUrl, upAdTelNumber,
    } = this.state;

    if (isLoadingAdList) {
      return <JBActIndicator title="내광고 로딩중.." size={35} />;
    }

    return (
      <View style={styles.container}>
        <AdUpdateModal
          isVisibleModal={isVisibleAdUpdateModal}
          closeModal={() => this.setState({ isVisibleAdUpdateModal: false })}
          upAdId={upAdId}
          upAdTitle={upAdTitle}
          upAdSubTitle={upAdSubTitle}
          upAdPhotoUrl={upAdPhotoUrl}
          upAdTelNumber={upAdTelNumber}
        />
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
          <JBButton
            title="내장비 홍보하기"
            onPress={() => navigation.navigate('AdCreate')}
            size="full"
          />
        </View>
      </View>
    );
  }
}

export default withLogin(AdScreen);
