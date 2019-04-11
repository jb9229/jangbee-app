import React from 'react';
import {
  FlatList, Picker, StyleSheet, Text, View,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import moment from 'moment';
import JBButton from '../components/molecules/JBButton';
import ClientEvaluCreateModal from '../components/ClientEvaluCreateModal';
import ClientEvaluUpdateModal from '../components/ClientEvaluUpdateModal';
import ClientEvaluLikeModal from '../components/ClientEvaluLikeModal';
import ListSeparator from '../components/molecules/ListSeparator';
import { withLogin } from '../contexts/LoginProvider';
import * as api from '../api/api';
import { notifyError } from '../common/ErrorNotice';
import CliEvaluItem from '../components/organisms/CliEvaluItem';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  evaluListWrap: {
    flex: 1,
  },
  searchHeaderWrap: {
    marginBottom: 10,
    backgroundColor: colors.batangDark,
    elevation: 14,
    borderRadius: 10,
    margin: 5,
  },
  searchHeaderTopWrap: {
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchPicker: {
    width: 140,
    color: colors.point,
  },
  containerSearchBar: {
    backgroundColor: colors.batangDark,
    borderTopColor: colors.batangDark,
    borderBottomColor: colors.batangDark,
    paddingTop: 5,
    paddingBottom: 5,
  },
  inputSearchBar: {
    fontSize: 16,
    paddingLeft: 3,
  },
  searchNoticeWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchNoticeText: {
    color: colors.pointDark,
    fontFamily: fonts.batang,
    justifyContent: 'center',
    fontSize: 13,
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
      searchNotice: '',
      searchWord: '',
      searchArea: 'TEL',
      searchPlaceholder: '전화번호 입력(- 없이)',
    };
  }

  componentDidMount() {
    this.setClinetEvaluList();
  }

  // componentWillReceiveProps(nextProps) {
  //   const { params } = nextProps.navigation.state;

  //   if (params !== undefined && params.refresh === true) {
  //     this.setClinetEvaluList();
  //   }
  // }

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
      .then(() => {
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
  openCliEvaluLikeModal = (item, isMine) => {
    this.setState({
      evaluLikeSelected: item,
      isMineEvaluation: isMine,
      isVisibleEvaluLikeModal: true,
    });

    this.setCliEvaluLikeList(item.id);
  };

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
        `블랙리스트 공감/비공감 취소 요청에 문제가 있습니다, 다시 시도해 주세요(${
          error.messages
        })`,
      ));
  };

  closeEvaluLikeModal = () => {
    this.setClinetEvaluList();
    this.setState({ isVisibleEvaluLikeModal: false });
  };

  /**
   * 블랙리스트 요청 함수
   */
  setClinetEvaluList = () => {
    const { user } = this.props;

    api
      .getClientEvaluList(user.uid)
      .then((resBody) => {
        if (resBody) {
          let notice;
          if (resBody.length === 0) {
            notice = '블랙리스트를 조회 또는 추가해 주세요.';
          } else {
            const beforeTwoMonth = moment()
              .add(-2, 'month')
              .format('MM/DD');
            const now = moment().format('MM/DD');
            notice = `최근[${beforeTwoMonth} ~ ${now}] 리스트 입니다, 평가 및 주의해 주세요.`;
          }
          this.setState({
            cliEvaluList: resBody,
            searchNotice: notice,
            isCliEvaluLoadComplete: true,
          });
          return;
        }

        this.setState({ isCliEvaluLoadComplete: false });
      })
      .catch((ex) => {
        notifyError(
          '최근 블랙리스트 요청 문제',
          `최근 블랙리스트 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`,
        );

        this.setState({ isCliEvaluLoadComplete: false });
      });
  };

  /**
   * 블랙리스트 필터링 함수
   */
  searchFilterCliEvalu = () => {
    const { searchArea, searchWord } = this.state;

    if (!searchWord) {
      this.setClinetEvaluList();
      return;
    }

    let paramStr;

    if (searchArea === 'CLI_NAME') {
      paramStr = `cliName=${searchWord}`;
    }

    if (searchArea === 'FIRM_NAME') {
      paramStr = `firmName=${searchWord}`;
    }

    if (searchArea === 'TEL') {
      paramStr = `telNumber=${searchWord}`;
    }

    if (searchArea === 'FIRM_NUMBER') {
      paramStr = `firmNumber=${searchWord}`;
    }

    api
      .searchClientEvaluList(paramStr)
      .then((resBody) => {
        if (resBody) {
          let notice = '';
          if (resBody.length === 0) {
            notice = `[${searchWord}]는 현재 블랙리스트에 조회되지 않습니다.`;
          }
          this.setState({
            cliEvaluList: resBody,
            searchNotice: notice,
            isCliEvaluLoadComplete: true,
          });
        }
      })
      .catch((ex) => {
        notifyError(
          '블랙리스트 요청 문제',
          `블랙리스트 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`,
        );

        this.setState({ isCliEvaluLoadComplete: false });
      });
  };

  /**
   * 블랙리스트 업데이트 함수
   */
  openUpdateCliEvaluForm = (item) => {
    this.setState({
      updateId: item.id,
      updateCliName: item.cliName,
      updateFirmName: item.firmName,
      updateTelNumber2: item.telNumber2,
      updateTelNumber3: item.telNumber3,
      updateFirmNumber: item.firmNumber,
      updateReason: item.reason,
      isVisibleUpdateModal: true,
    });
  };

  onSearchAreaChange = (itemValue) => {
    if (itemValue === 'TEL') {
      this.setState({ searchArea: itemValue, searchPlaceholder: '전화번호 입력(- 없이)' });
    }
    if (itemValue === 'FIRM_NUMBER') {
      this.setState({ searchArea: itemValue, searchPlaceholder: '사업자번호 입력(- 포함)' });
    }
    if (itemValue === 'FIRM_NAME') {
      this.setState({ searchArea: itemValue, searchPlaceholder: '업체명 입력' });
    }
    if (itemValue === 'CLI_NAME') {
      this.setState({ searchArea: itemValue, searchPlaceholder: '고객명 입력' });
    }
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

  render() {
    const {
      searchWord,
      searchArea,
      searchNotice,
      searchPlaceholder,
      updateId,
      updateCliName,
      updateFirmName,
      updateTelNumber2,
      updateTelNumber3,
      updateFirmNumber,
      updateReason,
      cliEvaluList,
      evaluLikeList,
      evaluLikeSelected,
      isMineEvaluation,
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
          firmName={updateFirmName}
          telNumber2={updateTelNumber2}
          telNumber3={updateTelNumber3}
          firmNumber={updateFirmNumber}
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
          isMine={isMineEvaluation}
        />
        <View style={styles.searchHeaderWrap}>
          <View style={styles.searchHeaderTopWrap}>
            <Picker
              selectedValue={searchArea}
              style={styles.searchPicker}
              onValueChange={this.onSearchAreaChange}
            >
              <Picker.Item label="전화번호" value="TEL" />
              <Picker.Item label="사업자번호" value="FIRM_NUMBER" />
              <Picker.Item label="업체명" value="FIRM_NAME" />
              <Picker.Item label="고객명" value="CLI_NAME" />
            </Picker>
            <JBButton
              title="블랙리스트 추가"
              onPress={() => this.setState({ isVisibleCreateModal: true })}
              size="small"
              align="right"
              bgColor={colors.batangDark}
              color={colors.pointDark}
            />
          </View>
          <SearchBar
            value={searchWord}
            placeholder={searchPlaceholder}
            containerStyle={styles.containerSearchBar}
            inputStyle={styles.inputSearchBar}
            lightTheme
            round
            onChangeText={text => this.setState({ searchWord: text })}
            searchIcon={{ onPress: () => this.searchFilterCliEvalu() }}
            onSubmitEditing={() => this.searchFilterCliEvalu()}
            autoCorrect={false}
          />
          <View style={styles.searchNoticeWrap}>
            <Text style={styles.searchNoticeText}>{searchNotice}</Text>
          </View>
        </View>

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
