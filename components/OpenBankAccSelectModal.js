import React from 'react';
import {
  FlatList, Modal, StyleSheet, View,
} from 'react-native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import ListSeparator from './molecules/ListSeparator';
import OBAccount from './molecules/OBAccount';
import * as firebaseDB from '../utils/FirebaseUtils';
import * as api from '../api/api';
import JBActIndicator from './organisms/JBActIndicator';
import { notifyError } from '../common/ErrorNotice';
import JBEmptyView from './organisms/JBEmptyView';

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  bgWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentsWrap: {
    backgroundColor: '#FFF',
    padding: 20,
  },
  commWrap: {
    flexDirection: 'row',
  },
});

export default class OpenBankAccSelectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selFinUseNum: '',
    };
  }

  componentDidMount() {
    this.setOpenBankAccountList();
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal, completeSelect } = this.props;
    const { selFinUseNum } = this.state;

    if (!selFinUseNum) {
      notifyError('유효성검사 에러', `[${selFinUseNum}] 계좌번호를 선택해 주세요`);
      return;
    }

    completeSelect(selFinUseNum);
  };

  onAccListItemPress = (fintechUseNum) => {
    this.setState({ selFinUseNum: fintechUseNum });
  };

  /**
   * 광고 결재할 계좌리스트 설정함수
   */
  setOpenBankAccountList = () => {
    const { accountId } = this.props;

    firebaseDB.getUserInfo(accountId).then((data) => {
      const fUserInfo = data.val();

      const { obAccessToken, obUserSeqNo } = fUserInfo;
      if (obAccessToken === undefined || obUserSeqNo === undefined) {
        this.setState({ isEmptyList: true });
        return;
      }

      api
        .getOBAccList(obAccessToken, obUserSeqNo, 'N', 'A')
        .then((userInfo) => {
          if (userInfo.res_cnt !== '0') {
            this.setState({ accList: userInfo.res_list, isEmptyList: false });
            return;
          }
          this.setState({ isEmptyList: true });
        })
        .catch((error) => {
          notifyError(
            '네트워크 문제가 있습니다, 다시 시도해 주세요.',
            `계좌리스트 조회 실패 -> [${error.name}] ${error.message}`,
          );

          this.setState({ isEmptyList: null });
        });
    });
  };

  render() {
    const {
      isVisibleModal, actionName, navigation, closeModal, reauthAfterAction,
    } = this.props;
    const { isEmptyList, accList, selFinUseNum } = this.state;

    if (isEmptyList === undefined) {
      return <JBActIndicator title="통장리스트 불러오는중.." size={35} />;
    }

    if (isEmptyList === null) {
      return (
        <JBEmptyView
          title="통장리스트 호출에 문제가 있습니다,"
          subTitle="네트워크 환경 확인하여 재시도 후, 문제가 지속되면 관리자에게 문의(내정보 -> 메일문의)해주세요."
          actionName="재시도하기"
          refresh={() => this.setOpenBankAccountList()}
        />
      );
    }

    if (isEmptyList) {
      return (
        <JBEmptyView
          title="통장리스트가 비어 있습니다."
          subTitle="결제계좌 등록 또는 재인증후 다시 진행해 주세요."
          actionName="통장 등록하기"
          refresh={() => {
            closeModal();
            navigation.navigate('OpenBankAuth', {
              type: 'REAUTH',
              completeAction: reauthAfterAction,
            });
          }}
        />
      );
    }

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => {
          console.log('modal close');
        }}
      >
        <View style={styles.bgWrap}>
          <View style={styles.contentsWrap}>
            <JBIcon name="close" size={23} onPress={() => closeModal()} />
            <FlatList
              data={accList}
              extraData={selFinUseNum}
              renderItem={({ item }) => OBAccount(item, selFinUseNum, this.onAccListItemPress)}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ListSeparator}
            />
            <JBButton
              title={actionName}
              onPress={() => this.completeAction()}
              size="full"
              Primary
            />
          </View>
        </View>
      </Modal>
    );
  }
}
