import React from 'react';
import {
  Alert, Modal, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import * as api from '../api/api';
import fonts from '../constants/Fonts';
import colors from '../constants/Colors';
import JBButton from './molecules/JBButton';
import FirmInfoItem from './organisms/FirmInfoItem';
import { notifyError } from '../common/ErrorNotice';
import callLink from '../common/CallLink';
import JBIcon from './molecules/JBIcon';
import JBActIndicator from './organisms/JBActIndicator';

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'rgba(250, 250, 250, 0.3)',
    elevation: 3,
    borderRadius: 5,
  },
  fnameText: {
    fontSize: 30,
    fontFamily: fonts.titleTop,
    color: colors.point2Dark,
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
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }

  init = (props) => {
    const { isVisibleModal, accountId } = props;

    if (isVisibleModal && accountId) {
      this.setMyFirmInfo(accountId);
      this.setFirmEvaluList(accountId);
    }
  };

  setMyFirmInfo = (accountId) => {
    if (!accountId) {
      Alert.alert(`[${accountId}] 유효하지 않은 사용자 입니다`);
      return;
    }

    this.setState({ isLoadingComplete: false });
    api
      .getFirm(accountId)
      .then((firm) => {
        if (firm) {
          this.setState({ firm, isLoadingComplete: true });
        }
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
  setFirmEvaluList = (accountId) => {
    if (!accountId) {
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

  render() {
    const { isVisibleModal, closeModal, hideCallButton } = this.props;
    const { firm, isLoadingComplete, evaluList } = this.state;

    if (!isLoadingComplete) {
      return (
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <JBActIndicator size={32} />
        </Modal>
      );
    }

    if (firm === undefined) {
      return (
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <View style={styles.regFirmWrap}>
            <Text style={styles.regFirmNotice}>업체상세 정보 요청에 문제가 있습니다,</Text>
            <Text style={styles.regFirmNotice}>다시 시도해 주세요.</Text>
            <JBButton title="새로고침" onPress={() => this.init()} />
          </View>
        </Modal>
      );
    }

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrViewWrap}>
            <FirmInfoItem firm={firm} evaluList={evaluList} />
          </ScrollView>
          <View style={styles.titleWrap}>
            <JBIcon name="close" size={23} onPress={() => closeModal()} />
            <Text style={styles.fnameText}>{firm.fname}</Text>
          </View>

          {!hideCallButton && (
            <View style={styles.callButWrap}>
              <JBButton
                title="전화걸기"
                onPress={() => callLink(firm.phoneNumber, true)}
                size="full"
                Primary
              />
            </View>
          )}
        </View>
      </Modal>
    );
  }
}
