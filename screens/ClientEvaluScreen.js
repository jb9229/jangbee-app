import React from 'react';
import {
  FlatList, StyleSheet, Text, View,
} from 'react-native';
import JBButton from '../components/molecules/JBButton';
import ClientEvaluCreateModal from '../components/ClientEvaluCreateModal';
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
      isCliEvaluLoadComplete: undefined,
    };
  }

  componentDidMount() {
    this.setClinetEvaluList();
  }

  /**
   * 블랙리스트 요청 함수
   */
  setClinetEvaluList = () => {
    api
      .getClientEvaluList()
      .then((resBody) => {
        if (resBody) {
          this.setState({ cliEvaluList: resBody, isCliEvaluLoadComplete: true });
          return;
        }
        this.setState({ isCliEvaluLoadComplete: false });
      })
      .catch(ex => notifyError('블랙리스트 추가 실패', ex.message));
  };

  /**
   * 블랙리스트 리스트 아이템 렌더링 함수
   */
  renderCliEvaluItem = ({ item }) => (<CliEvaluItem item={item} />)

  render() {
    const { cliEvaluList, isVisibleCreateModal, isCliEvaluLoadComplete } = this.state;
    const { user } = this.props;

    return (
      <View style={styles.Container}>
        <Text>
          블랙시스트 고객의 전화가 왔을 때, 하기 평가내용의 알림을 받을 수 있게 기능을 발전해 갈
          것입니다.
        </Text>
        <View>
          <ClientEvaluCreateModal
            accountId={user.uid}
            isVisibleModal={isVisibleCreateModal}
            closeModal={() => this.setState({ isVisibleCreateModal: false })}
            completeAction={() => this.setClinetEvaluList()}
            size="full"
          />
          <JBButton
            title="블랙리스트 추가"
            onPress={() => this.setState({ isVisibleCreateModal: true })}
          />

          {isCliEvaluLoadComplete === true && (
            <FlatList
              data={cliEvaluList}
              renderItem={this.renderCliEvaluItem}
              keyExtractor={(item, index) => index.toString()}
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
          <View style={styles.evaluListWrap}>
            <Text>맞아요/틀려요</Text>
            <Text>내 작성건 수정/삭제</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default withLogin(ClientEvaluScreen);
