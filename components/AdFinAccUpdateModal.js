import React from 'react';
import {
  Alert, FlatList, Modal, StyleSheet, Text, View,
} from 'react-native';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import ListSeparator from './molecules/ListSeparator';
import * as firebaseDB from '../utils/FirebaseUtils';
import * as api from '../api/api';
import JBActIndicator from './organisms/JBActIndicator';
import { notifyError } from '../common/ErrorNotice';

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
});

export default class AdFinAccUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { closeModal, accountId, completeUpdate } = this.props;
    const { selFinUseNum } = this.state;

    if (!selFinUseNum) {
      Alert.alert('유효성검사 에러', `[${selFinUseNum}] 변경할 계좌번호를 선택해 주세요`);
      return false;
    }

    api
      .updateFinUseNumAd(selFinUseNum, accountId)
      .then((updateResult) => {
        if (updateResult) {
          completeUpdate(selFinUseNum);
          closeModal();
        } else {
          Alert.alert('광고 업데이트에 문제가 있습니다', 'FintechUseNum 업데이트 요청 실패, 재시도해 주세요');
        }
      })
      .catch(error => notifyError('광고업데이트에 문제가 있습니다', error.message));
  };

  /**
   * 광고 결재할 계좌리스트 설정함수
   */
  setOpenBankAccountList = async () => {
    const { accountId } = this.props;

    const fUserInfo = await firebaseDB.getUserInfo(accountId);

    const { obAccessToken, obUserSeqNo } = fUserInfo;
    if (obAccessToken === undefined || obUserSeqNo === undefined) {
      this.setState({ isLoadingComplete: false });
      return;
    }

    api
      .getOBAccList(obAccessToken, obUserSeqNo, 'N', 'A')
      .then((userInfo) => {
        if (userInfo.res_cnt !== '0') {
          this.setState({ accList: userInfo.res_list, isLoadingComplete: true });
          return;
        }
        this.setState({ isLoadingComplete: false });
      })
      .catch((error) => {
        Alert.alert(
          '네트워크 문제가 있습니다, 다시 시도해 주세요.',
          `계좌리스트 조회 실패 -> [${error.name}] ${error.message}`,
        );

        this.setState({ isLoadingComplete: false });
      });
  };

  render() {
    const { navigation, isVisibleModal, closeModal } = this.props;
    const { isLoadingComplete, accList, selFinUseNum } = this.state;

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
            {isLoadingComplete === undefined && (
              <JBActIndicator title="결제 계좌 불러오는중..." size={32} />
            )}
            {isLoadingComplete && (
              <FlatList
                data={accList}
                extraData={selFinUseNum}
                renderItem={this.renderAccListItem}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={ListSeparator}
              />
            )}
            {!isLoadingComplete && (
              <View>
                <Text>결제계좌 호출에 실패 했습니다, 결제계좌 재인증 해 주세요.</Text>
                <JBButton
                  title="재인증 하기"
                  onPress={() => navigation.navigate('OpenBankAuth', { type: 'REAUTH' })}
                  align="center"
                />
              </View>
            )}

            <JBButton title="선택 완료" onPress={() => this.completeAction()} />
          </View>
        </View>
      </Modal>
    );
  }
}
