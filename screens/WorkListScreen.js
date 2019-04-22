import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import * as api from '../api/api';
import { withLogin } from '../contexts/LoginProvider';
import ClientEstimateFirmModal from '../components/ClientEstimateFirmModal';
import ClientOpenWorkList from '../components/ClientOpenWorkList';
import ClientMatchedWorkList from '../components/ClientMatchedWorkList';
import JBButton from '../components/molecules/JBButton';
import { notifyError } from '../common/ErrorNotice';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});

class ClientWorkListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleEstimateModal: false,
      isOpenWorkListEmpty: undefined,
      isMatchedWorkListEmpty: undefined,
      openWorkListRefreshing: false,
      matchedWorkListRefreshing: false,
      index: 0,
      routes: [{ key: 'first', title: '모집중인 일감' }, { key: 'second', title: '모집된 일감' }],
      openWorkList: [],
      matchedWorkList: undefined,
    };
  }

  componentDidMount() {
    // TODO did mount 후에는 setsate 안하게
    this.setOpenWorkListData();
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.navigation.state;

    if (params && params.refresh) {
      this.setOpenWorkListData();
    }
  }

  /**
   * Tab View 변경함수
   */
  changeTabView = (index) => {
    const { matchedWorkList } = this.state;

    if (index === 1 && matchedWorkList === undefined) {
      this.setMatchedWorkListData();
    }

    this.setState({ index });
  };

  /**
   * 업체평가 요청 함수
   */
  estimateFirm = () => {};

  /**
   * 리스트 데이터 설정함수
   */
  setOpenWorkListData = () => {
    const { user } = this.props;

    api
      .getClientOpenWorkList(user.uid)
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

  /**
   * 매칭된 일감리스트 설정함수
   */
  setMatchedWorkListData = () => {
    const { user } = this.props;

    api
      .getClientMatchedWorkList(user.uid)
      .then((resBody) => {
        if (resBody && resBody.length > 0) {
          this.setState({
            matchedWorkList: resBody,
            isMatchedWorkListEmpty: false,
            matchedWorkListRefreshing: false,
          });

          return;
        }

        this.setState({ isMatchedWorkListEmpty: true, matchedWorkListRefreshing: false });
      })
      .catch(error => notifyError(error.name, error.message));
  };

  render() {
    const { navigation } = this.props;
    const {
      isVisibleEstimateModal,
      isOpenWorkListEmpty,
      estiWorkId,
      matchedWorkList,
      isMatchedWorkListEmpty,
      openWorkList,
      openWorkListRefreshing,
      matchedWorkListRefreshing,
    } = this.state;

    const renderOpenWorkList = () => (
      <ClientOpenWorkList
        list={openWorkList}
        handleRefresh={() => this.setState({ openWorkListRefreshing: true }, () => this.setOpenWorkListData())
        }
        refreshing={openWorkListRefreshing}
        isListEmpty={isOpenWorkListEmpty}
        selectFirm={workId => navigation.navigate('AppliFirmList', { workId })}
        registerWork={() => navigation.navigate('WorkRegister')}
      />
    );

    const renderMatchedWorkList = () => (
      <ClientMatchedWorkList
        list={matchedWorkList}
        handleRefresh={() => this.setState({ matchedWorkListRefreshing: true }, () => this.setMatchedWorkListData())
        }
        refreshing={matchedWorkListRefreshing}
        isListEmpty={isMatchedWorkListEmpty}
        estimateFirm={workId => this.setState({ isVisibleEstimateModal: true, estiWorkId: workId })}
        openMatchedFirmInfo={matchedAccId => navigation.navigate('AppliFirmDetail', { accountId: matchedAccId, showPhoneNumber: true })
        }
      />
    );

    return (
      <View style={styles.Container}>
        <ClientEstimateFirmModal
          isVisibleModal={isVisibleEstimateModal}
          closeModal={() => this.setState({ isVisibleEstimateModal: false })}
          completeAction={() => this.setMatchedWorkListData()}
          workId={estiWorkId}
        />
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: renderOpenWorkList,
            second: renderMatchedWorkList,
          })}
          onIndexChange={this.changeTabView}
          initialLayout={{ width: Dimensions.get('window').width }}
        />

        <JBButton
          title="일감 등록하기"
          onPress={() => navigation.navigate('WorkRegister')}
          size="full"
          Primary
        />
      </View>
    );
  }
}

export default withLogin(ClientWorkListScreen);
