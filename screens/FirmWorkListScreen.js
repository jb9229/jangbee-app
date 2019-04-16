import React from 'react';
import {
  Alert, Dimensions, StyleSheet, View,
} from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import * as api from '../api/api';
import JBActIndicator from '../components/organisms/JBActIndicator';
import { withLogin } from '../contexts/LoginProvider';
import FirmWorkingList from '../components/organisms/FirmWorkingList';
import JBEmptyView from '../components/organisms/JBEmptyView';
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
const SecondRoute = () => <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />;

class FirmWorkListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isListEmpty: undefined,
      index: 0,
      routes: [{ key: 'first', title: '진행중인 일감' }, { key: 'second', title: '매칭된 일감' }],
      workList: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { navigation, user } = this.props;
    const myEquipment = await getMyEquipment(user.uid);

    if (myEquipment) {
      this.setListData(myEquipment);
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
      this.setState({ isListEmpty: true });
    }
  };

  /**
   * 리스트 데이터 설정함수
   */
  setListData = (equipment) => {
    const { user } = this.props;

    api
      .getFirmWorkingList(equipment, user.uid)
      .then((resBody) => {
        if (resBody && resBody.length > 0) {
          this.setState({ workList: resBody, isListEmpty: false });

          return;
        }

        this.setState({ isListEmpty: true });
      })
      .catch(error => notifyError(error.name, error.message));
  };

  render() {
    const {
      isListEmpty, tabViewIndex, routes, workList,
    } = this.state;

    if (isListEmpty === undefined) {
      return <JBActIndicator title="정보 불러오는중.." size={35} />;
    }

    if (isListEmpty) {
      return (
        <JBEmptyView
          title="현재 일감 리스트가 비어 있습니다,"
          subTitle="다시 조회해 보세요"
          refresh={this.init}
        />
      );
    }

    const FirstRoute = () => <FirmWorkingList list={workList} />;

    return (
      <View style={styles.Container}>
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: FirstRoute,
            second: SecondRoute,
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
      </View>
    );
  }
}

export default withLogin(FirmWorkListScreen);
