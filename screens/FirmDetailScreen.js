import React from 'react';
import {
  Alert,
  ActivityIndicator,
  Linking,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import firebase from 'firebase';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import * as api from '../api/api';
import FirmTextItem from '../components/FirmTextItem';
import FirmImageItem from '../components/FirmImageItem';
import fonts from '../constants/Fonts';
import CmException from '../common/CmException';
import colors from '../constants/Colors';
import JBButton from '../components/molecules/JBButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regFirmWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.point2,
  },
  regFirmNotice: {
    fontSize: 13,
    marginBottom: 20,
    fontFamily: fonts.batang,
    color: 'white',
  },
  regFirmText: {
    fontSize: 24,
    fontFamily: fonts.point2,
    textDecorationLine: 'underline',
  },
  scrViewWrap: {
    marginTop: 36,
    paddingBottom: 36,
  },
  cardWrap: {
    flex: 1,
    backgroundColor: colors.batangLight,
    padding: 20,
    paddingTop: 6,
    paddingBottom: 6,
  },
  pointCard: {
    backgroundColor: colors.point2,
  },
  largeCard: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBatang,
    padding: 5,
    borderRadius: 15,
  },
  frimTopItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firmLinkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topCommWrap: {
    flexDirection: 'row',
    marginRight: 25,
  },
  titleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 13,
    backgroundColor: 'rgba(250, 250, 250, 0.3)',
    elevation: 3,
    borderRadius: 5,
  },
  fnameText: {
    fontSize: 23,
    fontFamily: fonts.titleTop,
    color: colors.point2,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  callButWrap: {
    backgroundColor: colors.batangLight,
  },
});

export default class FirmMyInfoScreen extends React.Component {
  static navigationOptions = () => ({
    title: '장비 업체정보',
  });

  constructor(props) {
    super(props);
    this.state = {
      firm: undefined,
      isVisibleProfileModal: false,
      isLoadingComplete: false,
    };
  }

  componentDidMount() {
    this.setMyFirmInfo();
  }

  componentWillReceiveProps(nextProps) {
    const { refresh } = nextProps.navigation.state.params;

    if (refresh !== undefined) {
      this.setMyFirmInfo();
    }
  }

  setMyFirmInfo = () => {
    const { accountId } = this.props.navigation.state.params;

    if (accountId === null || accountId === undefined) {
      Alert.alert(`[${accountId}] 유효하지 않은 사용자 입니다`);
      return;
    }

    api
      .getFirm(accountId)
      .then((res) => {
        if (res.ok) {
          if (res.status === 204) {
            return undefined;
          }
          return res.json();
        }

        throw new CmException(res.status, `${res.url}`);
      })
      .then((firm) => {
        this.setState({ firm, isLoadingComplete: true });
      })
      .catch((error) => {
        Alert.alert(
          `업체정보 요청에 문제가 있습니다, 다시 시도해 주세요 -> [${error.name}] ${error.message}`,
        );
        this.setState({ isLoadingComplete: true });
      });
  };

  registerFirm = () => {
    const { navigation } = this.props;

    navigation.navigate('FirmRegister');
  };

  /**
   * 업체 블로그/홈페이지/SNS링크 열기
   */
  openLinkUrl = (url) => {
    if (url === null || url === '') {
      return;
    }

    Linking.openURL(url).catch(Alert.alert(`링크 열기에 문제가 있습니다 [${url}]`));
  };

  /**
   * 로그아웃 함수
   */
  onSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      Alert.alert('로그아웃에 문제가 있습니다, 재시도해 주세요.');
    }
  };

  render() {
    const { firm, isVisibleProfileModal, isLoadingComplete } = this.state;
    if (!isLoadingComplete) {
      return (
        <View style={styles.container}>
          <Text>업체정보 불러오는중...</Text>
          <ActivityIndicator size="large" color={colors.indicator} />
        </View>
      );
    }

    if (firm === undefined) {
      return (
        <View style={styles.container}>
          <View style={styles.regFirmWrap}>
            <Text style={styles.regFirmNotice}>
              고객님들 검색에 콜받을 수 있게, 업체정보를 등록해 주세요.
            </Text>
            <JBButton title="업체정보 등록하기" onPress={() => this.registerFirm()} size="big" />
            <JBButton title="로그아웃" onPress={() => this.onSignOut()} underline />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrViewWrap}>
          <View style={[styles.cardWrap]}>
            <View style={[styles.card, styles.pointCard]}>
              <View style={styles.frimTopItemWrap}>
                <View style={styles.firmLinkWrap}>
                  <TouchableOpacity onPress={() => this.openLinkUrl(firm.blog)}>
                    <MaterialCommunityIcons
                      name="blogger"
                      size={32}
                      color={firm.blog !== '' ? colors.pointDark : 'gray'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.openLinkUrl(firm.homepage)}>
                    <MaterialCommunityIcons
                      name="home-circle"
                      size={32}
                      color={firm.homepage !== '' ? colors.pointDark : 'gray'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.openLinkUrl(firm.sns)}>
                    <AntDesign
                      name="facebook-square"
                      size={32}
                      color={firm.sns !== '' ? colors.pointDark : 'gray'}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.topCommWrap}>
                  <Image style={styles.thumbnail} source={{ uri: firm.thumbnail }} />
                </View>
              </View>

              <FirmTextItem title="보유장비" value={firm.equiListStr} revColor />
              <FirmTextItem
                title="주소"
                value={`${firm.address}\n${firm.addressDetail}`}
                revColor
              />
              <FirmTextItem title="업체소개" value={firm.introduction} revColor />
            </View>
          </View>
          <View style={[styles.cardWrap, styles.largeCard]}>
            <View style={[styles.card]}>
              <FirmImageItem title="작업사진1" value={firm.photo1} />
              <FirmImageItem title="작업사진2" value={firm.photo2} />
              <FirmImageItem title="작업사진3" value={firm.photo3} />
            </View>
          </View>
        </ScrollView>
        <View style={styles.titleWrap}>
          <Text style={styles.fnameText}>{firm.fname}</Text>
        </View>

        <View style={styles.callButWrap}>
          <JBButton
            title="전화걸기"
            onPress={() => this.openLinkUrl(`tel:${firm.phoneNumber}`)}
            size="full"
          />
        </View>
      </View>
    );
  }
}
