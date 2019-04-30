import React from 'react';
import {
  Alert, ActivityIndicator, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import firebase from 'firebase';
import * as api from '../api/api';
import fonts from '../constants/Fonts';
import colors from '../constants/Colors';
import JBButton from '../components/molecules/JBButton';
import FirmInfoItem from '../components/organisms/FirmInfoItem';
import { notifyError } from '../common/ErrorNotice';
import callLink from '../common/CallLink';

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
    marginTop: 39,
    paddingBottom: 39,
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
    alignItems: 'center',
    marginRight: 25,
  },
  rating: {
    backgroundColor: colors.point2,
  },
  titleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'rgba(250, 250, 250, 0.3)',
    elevation: 3,
    borderRadius: 5,
  },
  fnameText: {
    fontSize: 30,
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
    headerStyle: {
      marginTop: -28,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      firm: undefined,
      evaluList: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    const { refresh } = nextProps.navigation.state.params;

    if (refresh !== undefined) {
      this.setMyFirmInfo();
    }
  }

  init = () => {
    this.setMyFirmInfo();
    this.setFirmEvaluList();
  };

  setMyFirmInfo = () => {
    const { accountId } = this.props.navigation.state.params;

    if (accountId === null || accountId === undefined) {
      Alert.alert(`[${accountId}] 유효하지 않은 사용자 입니다`);
      return;
    }

    api
      .getFirm(accountId)
      .then((firm) => {
        this.setState({ firm, isLoadingComplete: true });
      })
      .catch((error) => {
        Alert.alert(
          '업체정보 요청 문제발생',
          `요청 도중 문제가 발생 했습니다, 다시 시도해 주세요 -> [${error.name}] ${error.message}`,
        );
        this.setState({ isLoadingComplete: true });
      });
  };

  /**
   * 업체 평가 리스트 설정함수
   */
  setFirmEvaluList = () => {
    const { accountId } = this.props.navigation.state.params;

    if (accountId === null || accountId === undefined) {
      Alert.alert(`[${accountId}] 유효하지 않은 사용자 입니다`);
      return;
    }

    api
      .getFirmEvalu(accountId)
      .then((evaluList) => {
        if (evaluList) {
          this.setState({ evaluList });
        }
      })
      .catch((error) => {
        notifyError(
          '업체후기 요청 문제발생',
          `요청 도중 문제가 발생 했습니다, 다시 시도해 주세요 -> [${error.name}] ${error.message}`,
        );
      });
  };

  registerFirm = () => {
    const { navigation } = this.props;

    navigation.navigate('FirmRegister');
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
    const { firm, isLoadingComplete, evaluList } = this.state;
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
            <Text style={styles.regFirmNotice}>업체상세 정보 요청에 문제가 있습니다,</Text>
            <Text style={styles.regFirmNotice}>다시 시도해 주세요.</Text>
            <JBButton title="새로고침" onPress={() => this.init()} />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrViewWrap}>
          <FirmInfoItem firm={firm} evaluList={evaluList} />
        </ScrollView>
        <View style={styles.titleWrap}>
          <Text style={styles.fnameText}>{firm.fname}</Text>
        </View>

        <View style={styles.callButWrap}>
          <JBButton
            title="전화걸기"
            onPress={() => callLink(firm.phoneNumber, true)}
            size="full"
            Primary
          />
        </View>
      </View>
    );
  }
}
