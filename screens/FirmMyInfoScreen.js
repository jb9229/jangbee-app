import React from 'react';
import {
  Alert, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import firebase from 'firebase';
import * as api from '../api/api';
import { notifyError } from '../common/ErrorNotice';
import fonts from '../constants/Fonts';
import { withLogin } from '../contexts/LoginProvider';
import FirmProfileModal from '../components/FirmProfileModal';
import colors from '../constants/Colors';
import JBButton from '../components/molecules/JBButton';
import JBActIndicator from '../components/organisms/JBActIndicator';
import JBIcon from '../components/molecules/JBIcon';
import FirmInfoItem from '../components/organisms/FirmInfoItem';
import JBTerm from '../components/JBTerm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.batangLight,
  },
  regFirmWrap: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.point2,
  },
  regFirmWordingWrap: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  regFirmNotice: {
    fontSize: 16,
    fontFamily: fonts.batang,
    color: 'white',
    margin: 5,
  },
  regFirmText: {
    fontSize: 24,
    fontFamily: fonts.point2,
    textDecorationLine: 'underline',
  },
  scrViewWrap: {
    marginTop: 40,
    paddingBottom: 40,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
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
});

class FirmMyInfoScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      firm: undefined,
      isVisibleProfileModal: false,
      isLoadingComplete: false,
      evaluList: [],
    };
  }

  componentDidMount() {
    this.setMyFirmInfo();
    this.setFirmEvaluList();
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.navigation.state;

    if (params !== undefined && params.refresh !== undefined) {
      this.setMyFirmInfo();
    }
  }

  setMyFirmInfo = () => {
    const { user } = this.props;

    if (user.uid === null || user.uid === undefined) {
      Alert.alert('유효하지 않은 사용자 입니다');
      return;
    }

    api
      .getFirm(user.uid)
      .then((firm) => {
        this.setState({ firm, isLoadingComplete: true });
      })
      .catch((error) => {
        notifyError(
          '업체정보 요청 문제발생',
          `요청 도중 문제가 발생 했습니다, 다시 시도해 주세요 -> [${error.name}] ${error.message}`,
          this.setMyFirmInfo,
        );
        this.setState({ isLoadingComplete: true });
      });
  };

  /**
   * 업체 평가 리스트 설정함수
   */
  setFirmEvaluList = () => {
    const { user } = this.props;

    if (!user.uid) {
      Alert.alert(`[${user.uid}] 유효하지 않은 사용자 입니다`);
      return;
    }

    api
      .getFirmEvalu(user.uid)
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

  /**
   * 프로파일 팝업창 열기 플래그 함수
   */
  setVisibleProfileModal = (visible) => {
    this.setState({ isVisibleProfileModal: visible });
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
    const {
      firm, isVisibleProfileModal, isLoadingComplete, evaluList,
    } = this.state;
    if (!isLoadingComplete) {
      return <JBActIndicator title="업체정보 불러오는중..." size={35} />;
    }

    if (!firm) {
      return (
        <View style={styles.regFirmWrap}>
          <JBButton
            title="로그아웃"
            onPress={() => this.onSignOut()}
            size="small"
            underline
            Secondary
            align="right"
          />
          <View style={styles.regFirmWordingWrap}>
            <Text style={styles.regFirmNotice}>+</Text>
            <Text style={styles.regFirmNotice}>고객이 장비업체를 찾고 있습니다.</Text>
            <Text style={styles.regFirmNotice}>무료등록 기회를 놓치지 마세요</Text>
          </View>
          <JBButton title="업체 등록하기" onPress={() => this.registerFirm()} size="big" align="center" Primary />
          <JBTerm bg={colors.point2Light} />
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
          <JBIcon name="settings" size={30} onPress={() => this.setVisibleProfileModal(true)} />
        </View>
        <FirmProfileModal
          isVisibleModal={isVisibleProfileModal}
          setVisibleModal={this.setVisibleProfileModal}
          firm={firm}
          onSignOut={this.onSignOut}
          {...this.props}
        />
      </View>
    );
  }
}

export default withLogin(FirmMyInfoScreen);
