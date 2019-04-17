import React from 'react';
import {
  Alert, Dimensions, StyleSheet, View,
} from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import * as api from '../api/api';
import { withLogin } from '../contexts/LoginProvider';
import FirmOpenWorkList from '../components/FirmOpenWorkList';
import FirmMatchedWorkList from '../components/FirmMatchedWorkList';
import { notifyError } from '../common/ErrorNotice';
import { getMyEquipment } from '../utils/AsyncStorageUtils';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
});

class FirmWorkListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenWorkListEmpty: undefined,
      isMatchedWorkListEmpty: undefined,
      openWorkListRefreshing: false,
      myEquipment: undefined,
      index: 0,
      routes: [{ key: 'first', title: '진행중인 일감' }, { key: 'second', title: '매칭된 일감' }],
      openWorkList: [],
      matchedList: undefined,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { navigation, user } = this.props;
    const myEquipment = await getMyEquipment(user.uid);

    if (myEquipment) {
      this.setState({ myEquipment }, () => this.setOpenWorkListData());
    } else {
      Alert.alert(
        '보유장비 조회 문제',
        '내정보 -> 장비등록하기 또는 네트워크문제로 다시 시도해 주세요.',
        [
          { text: '다시 시도하기', onPress: () => this.init() },
          { text: '장비등록하러 가기', onPress: () => navigation.navigate('FirmMyInfo') },
        ],
        { cancelable: false },
      );
      this.setState({ isOpenWorkListEmpty: true });
    }
  };

  /**
   * 일감 매칭요청 수락하기 함수
   */
  acceptWork = () => {};

  /**
   * 일감지원하기 요청 함수
   */
  applyWork = (workId) => {
    const { user } = this.props;

    const applyData = {
      workId,
      accountId: user.uid,
    };

    api
      .applyWork(applyData)
      .then((resBody) => {
        if (resBody) {
          this.setOpenWorkListData();
        }
      })
      .catch((error) => {
        notifyError(error.name, error.message);
      });
  };

  changeTabView = (index) => {
    const { matchedList } = this.state;

    if (index === 1 && matchedList === undefined) {
      this.setMatchedWorkListData();
    }

    this.setState({ index });
  };

  /**
   * 매칭된 일감리스트 설정함수
   */
  setMatchedWorkListData = () => {
    const { user } = this.props;
    const { myEquipment } = this.state;

    api
      .getMatchedFirmWorkList(myEquipment, user.uid)
      .then((resBody) => {
        if (resBody && resBody.length > 0) {
          this.setState({
            matchedList: resBody,
            isMatchedWorkListEmpty: false,
            matchedWorkListRefreshing: false,
          });

          return;
        }

        this.setState({ isMatchedWorkListEmpty: true, matchedWorkListRefreshing: false });
      })
      .catch(error => notifyError(error.name, error.message));
  };

  /**
   * 진행중인 일감리스트 데이터 설정함수
   */
  setOpenWorkListData = () => {
    const { user } = this.props;
    const { myEquipment } = this.state;

    api
      .getOpenFirmWorkList(myEquipment, user.uid)
      .then((resBody) => {
        if (resBody && resBody.length > 0) {
          this.setState({
            openWorkList: resBody,
            isOpenWorkListEmpty: false,
            openWorkListRefreshing: false,
          });

          return;
        }

        this.setState({ isOpenWorkListEmpty: true, openWorkListRefreshing: false });
      })
      .catch(error => notifyError(error.name, error.message));
  };

  render() {
    const {
      isOpenWorkListEmpty,
      isMatchedWorkListEmpty,
      openWorkList,
      matchedWorkList,
      openWorkListRefreshing,
      matchedWorkListRefreshing,
    } = this.state;
    const renderOpenWorkList = () => (
      <FirmOpenWorkList
        list={openWorkList}
        handleRefresh={() => this.setState({ openWorkListRefreshing: true }, () => this.setOpenWorkListData())
        }
        refreshing={openWorkListRefreshing}
        isListEmpty={isOpenWorkListEmpty}
        applyWork={this.applyWork}
        acceptWork={this.acceptWork}
      />
    );

    const renderMatchedWorkList = () => (
      <FirmMatchedWorkList
        list={matchedWorkList}
        handleRefresh={() => this.setState({ matchedWorkListRefreshing: true }, () => this.setMatchedWorkListData())
        }
        refreshing={matchedWorkListRefreshing}
        isListEmpty={isMatchedWorkListEmpty}
      />
    );
    return (
      <View style={styles.Container}>
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: renderOpenWorkList,
            second: renderMatchedWorkList,
          })}
          onIndexChange={this.changeTabView}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
      </View>
    );
  }
}

export default withLogin(FirmWorkListScreen);
