import React from 'react';
import {
  FlatList, StyleSheet, Text, View,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import JBButton from '../components/molecules/JBButton';
import ClientEvaluCreateModal from '../components/ClientEvaluCreateModal';
import ClientEvaluUpdateModal from '../components/ClientEvaluUpdateModal';
import ClientEvaluLikeModal from '../components/ClientEvaluLikeModal';
import ListSeparator from '../components/molecules/ListSeparator';
import { withLogin } from '../contexts/LoginProvider';
import * as api from '../api/api';
import { notifyError } from '../common/ErrorNotice';
import CliEvaluItem from '../components/organisms/CliEvaluItem';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  evaluListWrap: {
    flex: 1,
  },
});

class ClientEvaluScreen extends React.Component {
  static navigationOptions = {
    title: '블랙리스트 고객',
    headerStyle: {
      marginTop: -28,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisibleCreateModal: false,
      isVisibleUpdateModal: false,
      isVisibleEvaluLikeModal: false,
      isCliEvaluLoadComplete: undefined,
      evaluLikeList: [],
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.setClinetEvaluList();
  }

  deleteCliEvalu = (id) => {
    api
      .deleteCliEvalu(id)
      .then(() => this.setClinetEvaluList())
      .catch(error => notifyError(
        '블랙리스트 삭제 문제',
        `블랙리스트 삭제에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`,
      ));
  };

  /**
   * 공감/비공감 API 요청 함수
   *
   * @param {object} newEvaluLike 공감/비공감 추가할 데이터
   */
  createClientEvaluLike = (newEvaluLike) => {
    api
      .createClientEvaluLike(newEvaluLike)
      .then((resBody) => {
        this.setCliEvaluLikeList(newEvaluLike.evaluId);
      })
      .catch(error => notifyError(
        '공감/비공감 요청 문제',
        `요청에 문제가 있습니다, 다시 시도해 주세요${error.message}`,
      ));
  };

  /**
   * 블랙리스트 평가 팝업 오픈
   *
   */
  openCliEvaluLikeModal = (item) => {
    this.setState({ evaluLikeSelected: item, isVisibleEvaluLikeModal: true });

    this.setCliEvaluLikeList(item.id);
  }

  /**
   * 블랙리스트 평가 데이터 설정 함수
   */
  setCliEvaluLikeList = (evaluId) => {
    api
      .getClientEvaluLikeList(evaluId)
      .then((resBody) => {
        this.setState({ evaluLikeList: resBody });
      })
      .catch(error => notifyError(
        '블랙리스트 공감 조회 문제',
        `공감 조회에 문제가 있습니다, 다시 시도해 주세요(${error.message})`,
      ));
  };

  /**
   * 공감/비공감 삭제 함수
   *
   * @param {string} accountId 공감/비공감 삭제할 계정 아이디
   */
  cancelClientEvaluLike = (evaluation, like) => {
    const { user } = this.props;
    api
      .deleteCliEvaluLike(evaluation.id, user.uid, like)
      .then(() => this.setCliEvaluLikeList(evaluation.id))
      .catch(error => notifyError(
        '공감/비공감 취소 문제',
        `블랙리스트 공감/비공감 취소 요청에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`,
      ));
  }

  closeEvaluLikeModal = () => {
    this.setClinetEvaluList();
    this.setState({ isVisibleEvaluLikeModal: false });
  }

  /**
   * 블랙리스트 요청 함수
   */
  setClinetEvaluList = () => {
    const { user } = this.props;

    api
      .getClientEvaluList(user.uid)
      .then((resBody) => {
        if (resBody) {
          this.setState({ cliEvaluList: resBody, isCliEvaluLoadComplete: true });
          this.arrayholder = resBody;
          return;
        }
        this.setState({ isCliEvaluLoadComplete: false });
      })
      .catch(ex => notifyError('블랙리스트 요청 문제', `블랙리스트 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`));
  };

  /**
   * 블랙리스트 필터링 함수
   */
  searchFilterCliEvalu = (text) => {
    const newData = this.arrayholder.filter((item) => {
      const textData = text;

      return item.telNumber.indexOf(textData) > -1 || item.cliName.indexOf(textData) > -1;
    });

    this.setState({ search: text, cliEvaluList: newData });
  };

  /**
   * 블랙리스트 업데이트 함수
   */
  openUpdateCliEvaluForm = (item) => {
    this.setState({
      updateId: item.id,
      updateCliName: item.cliName,
      updateReason: item.reason,
      isVisibleUpdateModal: true,
    });
  };

  /**
   * 블랙리스트 아이템 UI 렌더링 함수
   */
  renderCliEvaluItem = ({ item }) => {
    const { user } = this.props;

    return (
      <CliEvaluItem
        item={item}
        accountId={user.uid}
        updateCliEvalu={this.openUpdateCliEvaluForm}
        deleteCliEvalu={this.deleteCliEvalu}
        openCliEvaluLikeModal={this.openCliEvaluLikeModal}
      />
    );
  };

  /**
   * 블랙리스트 헤더 UI 렌더링 함수
   */
  renderCliEvaluHeader = () => {
    const { search } = this.state;

    return (
      <SearchBar
        value={search}
        placeholder="전화번호 또는 이름 입력..."
        lightTheme
        round
        onChangeText={text => this.searchFilterCliEvalu(text)}
        autoCorrect={false}
      />
    );
  };

  render() {
    const {
      updateId,
      updateCliName,
      updateReason,
      cliEvaluList,
      evaluLikeList,
      evaluLikeSelected,
      isVisibleCreateModal,
      isVisibleUpdateModal,
      isVisibleEvaluLikeModal,
      isCliEvaluLoadComplete,
    } = this.state;
    const { user } = this.props;

    return (
      <View style={styles.Container}>
        <ClientEvaluCreateModal
          isVisibleModal={isVisibleCreateModal}
          accountId={user.uid}
          closeModal={() => this.setState({ isVisibleCreateModal: false })}
          completeAction={() => this.setClinetEvaluList()}
          size="full"
        />
        <ClientEvaluUpdateModal
          id={updateId}
          cliName={updateCliName}
          reason={updateReason}
          isVisibleModal={isVisibleUpdateModal}
          closeModal={() => this.setState({ isVisibleUpdateModal: false })}
          completeAction={() => this.setClinetEvaluList()}
        />
        <ClientEvaluLikeModal
          isVisibleModal={isVisibleEvaluLikeModal}
          accountId={user.uid}
          evaluation={evaluLikeSelected}
          evaluLikeList={evaluLikeList}
          createClientEvaluLike={this.createClientEvaluLike}
          cancelClientEvaluLike={this.cancelClientEvaluLike}
          closeModal={() => this.closeEvaluLikeModal()}
        />
        <Text>
          블랙리스트 고객의 전화가 왔을 때, 하기 평가내용의 알림을 받을 수 있게 기능을 발전해 갈
          것입니다.
        </Text>
        <JBButton
          title="블랙리스트 추가"
          onPress={() => this.setState({ isVisibleCreateModal: true })}
          size="small"
          align="right"
        />

        {isCliEvaluLoadComplete === true && (
          <FlatList
            data={cliEvaluList}
            renderItem={this.renderCliEvaluItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={this.renderCliEvaluHeader}
            ItemSeparatorComponent={ListSeparator}
          />
        )}
        {isCliEvaluLoadComplete === false && (
          <View>
            <Text>
              블랙리스트 요청에 실패했거나 등록된 블랙 리스트가 없습니다, 다시 시도해 주세요.
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default withLogin(ClientEvaluScreen);
