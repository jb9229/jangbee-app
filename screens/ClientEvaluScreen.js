import React from 'react';
import {
  FlatList, StyleSheet, Text, View,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import JBButton from '../components/molecules/JBButton';
import ClientEvaluCreateModal from '../components/ClientEvaluCreateModal';
import ClientEvaluUpdateModal from '../components/ClientEvaluUpdateModal';
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
      isCliEvaluLoadComplete: undefined,
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
   * 블랙리스트 요청 함수
   */
  setClinetEvaluList = () => {
    api
      .getClientEvaluList()
      .then((resBody) => {
        if (resBody) {
          this.setState({ cliEvaluList: resBody, isCliEvaluLoadComplete: true });
          this.arrayholder = resBody;
          return;
        }
        this.setState({ isCliEvaluLoadComplete: false });
      })
      .catch(ex => notifyError('블랙리스트 추가 실패', ex.message));
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
      isVisibleCreateModal,
      isVisibleUpdateModal,
      isCliEvaluLoadComplete,
    } = this.state;
    const { user } = this.props;

    return (
      <View style={styles.Container}>
        <ClientEvaluCreateModal
          accountId={user.uid}
          isVisibleModal={isVisibleCreateModal}
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
