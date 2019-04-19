import React from 'react';
import {
  Alert, FlatList, StyleSheet, Text, View,
} from 'react-native';
import { withLogin } from '../contexts/LoginProvider';
import * as api from '../api/api';
import JBActIndicator from '../components/organisms/JBActIndicator';
import JangbeeAd from '../components/organisms/JangbeeAd';
import JBButton from '../components/molecules/JBButton';
import { getAdtypeStr } from '../constants/AdTypeStr';
import AdUpdateModal from '../components/AdUpdateModal';
import OpenBankAccSelectModal from '../components/OpenBankAccSelectModal';
import { notifyError } from '../common/ErrorNotice';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adEmptyViewWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWordWrap: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: colors.pointDark,
    borderTopWidth: 1,
  },
  emptyText: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: fonts.batang,
    color: colors.batang,
  },
  adListItemWrap: {
    margin: 10,
    paddingBottom: 3,
    borderBottomColor: colors.point2,
    borderBottomWidth: 1,
  },
  adItemTopWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adItemTopLeftWrap: {
    flexDirection: 'row',
  },
  adItemTopRightWrap: {
    flexDirection: 'row',
  },
  adListLeftWrap: {
    flex: 3,
  },
  adItemMidleWrap: {
    flexDirection: 'row',
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
      isVisibleFinAccUpdateModal: false,
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

  /**
   * 결제통장 변경 함수
   */
  changeAdPayAccount = (newFintechUseNum) => {
    api
      .updateFinUseNumAd(selFinUseNum, accountId)
      .then((updateResult) => {
        if (updateResult) {
          Alert.alert('결제통장 바꾸기 성공', `${newFintechUseNum}결제통장 바꾸기에 성공했습니다.`);
          this.setState({ isVisibleFinAccUpdateModal: false });
        } else {
          Alert.alert(
            '광고 업데이트에 문제가 있습니다',
            'FintechUseNum 업데이트 요청 실패, 재시도해 주세요',
          );
        }
      })
      .catch(error => notifyError('광고업데이트에 문제가 있습니다', error.message));
  };

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

    this.setState({
      upAdId: item.id,
      upAdTitle: item.title,
      upAdSubTitle: item.subTitle,
      upAdPhotoUrl: item.photoUrl,
      upAdTelNumber: item.telNumber,
    });
  };

  /**
   * 광고종료 재 확인 팝업
   */
  confirmTerminateAd = (item) => {
    Alert.alert(
      '광고 종료',
      `[${getAdtypeStr(item.adType)}] 정말 광고를 종료 하시겠습니까?`,
      [
        { text: '네', onPress: () => this.terminateAd(item.id) },
        {
          text: '아니요',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  /**
   * 광고종료 요청 함수
   */
  terminateAd = (id) => {
    if (!id || id < 1) {
      Alert.alert(
        '유효성검사 에러',
        `[${id}]종료 광고아이디를 찾지 못했습니다, 다시 시도해 주세요`,
      );
      return false;
    }

    api
      .terminateAd(id)
      .then(() => this.setAdList())
      .catch(error => notifyError('광고업데이트에 문제가 있습니다', error.message));

    return true;
  };

  renderAdListItem = ({ item, index }) => (
    <View style={styles.adListItemWrap}>
      <JangbeeAd ad={item} />
      <View style={styles.adListCommWrap}>
        <View style={styles.adItemTopWrap}>
          <View style={styles.adItemTopLeftWrap}>
            <Text>{index + 1}</Text>
            <Text>. </Text>
            <Text>{getAdtypeStr(item.adType)}</Text>
          </View>
          <View style={styles.adItemTopLeftWrap}>
            <JBButton
              title="해지"
              onPress={() => this.confirmTerminateAd(item)}
              size="small"
              underline
              color={colors.point2Dark}
            />
            <JBButton
              title="수정"
              onPress={() => this.updateAd(item)}
              size="small"
              underline
              color={colors.point2Dark}
            />
          </View>
        </View>
        <View style={styles.adItemMidleWrap}>
          <Text>{item.equiTarget}</Text>
          <View style={styles.adListTargetLocalWrap}>
            <Text>{item.sidoTarget}</Text>
            <Text>{item.gugunTarget}</Text>
          </View>
          <View style={styles.adListDateWrap}>
            <Text>{item.startDate}</Text>
            <Text> ~ </Text>
            <Text>{item.endDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  render() {
    const { navigation, user } = this.props;
    const {
      isLoadingAdList,
      isAdEmpty,
      adList,
      isVisibleAdUpdateModal,
      isVisibleFinAccUpdateModal,
      upAdId,
      upAdTitle,
      upAdSubTitle,
      upAdPhotoUrl,
      upAdTelNumber,
    } = this.state;

    if (isLoadingAdList) {
      return <JBActIndicator title="내광고 로딩중.." size={35} />;
    }

    if (isAdEmpty) {
      return (
        <View style={styles.adEmptyViewWrap}>
          <View style={styles.emptyWordWrap}>
            <Text style={styles.emptyText}>+</Text>
            <Text style={styles.emptyText}>등록된 광고가 없습니다.</Text>
            <Text style={styles.emptyText}>
              언제든 광고문구수정 가능, 저렴한 가격(월 1만원부터)
            </Text>
            <Text style={styles.emptyText}>한정된 광고자리, 나중엔 하고싶어도 못합니다.</Text>
            <Text style={styles.emptyText}>전봇대 스티커 붙이는 것보다 훨~씬 효과적 입니다.</Text>
          </View>
          <JBButton title="내장비 홍보하기" onPress={() => navigation.navigate('AdCreate')} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <AdUpdateModal
          isVisibleModal={isVisibleAdUpdateModal}
          closeModal={() => this.setState({ isVisibleAdUpdateModal: false })}
          completeUpdate={() => {
            this.setAdList();
            this.setState({ isVisibleAdUpdateModal: false });
          }}
          upAdId={upAdId}
          upAdTitle={upAdTitle}
          upAdSubTitle={upAdSubTitle}
          upAdPhotoUrl={upAdPhotoUrl}
          upAdTelNumber={upAdTelNumber}
        />
        <OpenBankAccSelectModal
          isVisibleModal={isVisibleFinAccUpdateModal}
          closeModal={() => this.setState({ isVisibleFinAccUpdateModal: false })}
          completeSelect={this.changeAdPayAccount}
          accountId={user.uid}
          {...this.props}
        />
        <FlatList
          data={adList}
          renderItem={this.renderAdListItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
        />
        <View style={styles.commWrap}>
          <JBButton
            title="결제통장 바꾸기"
            onPress={() => this.setState({ isVisibleFinAccUpdateModal: true })}
            size="small"
            underline
            Secondary
          />
          <View
            style={{
              borderLeftColor: colors.pointDark,
              borderLeftWidth: 1,
            }}
          />
          <JBButton
            title="내장비 홍보하기"
            onPress={() => navigation.navigate('AdCreate')}
            size={isAdEmpty ? 'full' : 'small'}
            Secondary
            underline
          />
        </View>
      </View>
    );
  }
}

export default withLogin(AdScreen);
