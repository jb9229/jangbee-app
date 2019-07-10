import React from 'react';
import {
  FlatList, Picker, StyleSheet, Text, View,
} from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { SearchBar } from 'react-native-elements';
import { notifyError } from '../common/ErrorNotice';
import { shareNotExistCEvalu } from '../common/JBCallShare';
import JBButton from '../components/molecules/JBButton';
import ClientEvaluCreateModal from '../components/ClientEvaluCreateModal';
import ClientEvaluUpdateModal from '../components/ClientEvaluUpdateModal';
import ClientEvaluLikeModal from '../components/ClientEvaluLikeModal';
import CliEvaluItem from '../components/organisms/CliEvaluItem';
import ClientEvaluDetailModal from '../components/ClientEvaluDetailModal';
import JangbeeAdList from '../components/JangbeeAdList';
import { withLogin } from '../contexts/LoginProvider';
import * as api from '../api/api';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.batangLight,
  },
  searchHeaderWrap: {
    marginTop: 10,
    marginLeft: 3,
    marginRight: 3,
    padding: 3,
    backgroundColor: colors.batangDark,
    elevation: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchHeaderTopWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchPicker: {
    width: 167,
    color: colors.point,
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
  },
  pickerArrowWrap: {
    justifyContent: 'center',
    position: 'absolute',
    top: 15,
    left: 117,
  },
  pickerArrow: {
    color: colors.pointDark,
  },
  commWrap: {
    flexDirection: 'row',
    marginRight: 3,
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
    padding: 5,
    paddingBottom: 8,
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

const NotExitButWrap = styled.View`
  flex: 1;
  justify-content: center;
  border-width: 1;
`;

class ClientEvaluScreen extends React.Component {
  static navigationOptions = {
    title: '피해사례 고객',
    headerStyle: {
      marginTop: -28,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisibleCreateModal: false,
      isVisibleUpdateModal: false,
      isVisibleDetailModal: false,
      isVisibleEvaluLikeModal: false,
      cliEvaluList: [],
      page: 0,
      isLastList: false,
      isNewestEvaluList: true,
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

  componentWillReceiveProps(nextProps) {
  }

  deleteCliEvalu = (id) => {
    api
      .deleteCliEvalu(id)
      .then(() => this.setClinetEvaluList())
      .catch(error => notifyError(
        '피해사례 삭제 문제',
        `피해사례 삭제에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`,
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
   * 피해사례 평가 팝업 오픈
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
   * 피해사례 평가 데이터 설정 함수
   */
  setCliEvaluLikeList = (evaluId) => {
    api
      .getClientEvaluLikeList(evaluId)
      .then((resBody) => {
        this.setState({ evaluLikeList: resBody });
      })
      .catch(error => notifyError(
        '피해사례 공감 조회 문제',
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
        `피해사례 공감/비공감 취소 요청에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`,
      ));
  };

  closeEvaluLikeModal = (refresh) => {
    if (refresh) { this.setClinetEvaluList(); }
    this.setState({ isVisibleEvaluLikeModal: false });
  };

  /**
   * 내가 등록한 피해사례 요청 함수
   */
  setMyClinetEvaluList = () => {
    const { user } = this.props;
    const { page, cliEvaluList } = this.state;

    api
      .getClientEvaluList(page, user.uid, true)
      .then((resBody) => {
        if (resBody && resBody.content) {
          let notice;
          if (resBody.content.length === 0) {
            notice = '내가 등록한 피해사례가 없습니다.';
            this.setState({
              cliEvaluList: [],
              searchNotice: notice,
              isLastList: resBody.last,
              notExistCEvalu: false,
            });

            return;
          }

          notice = '내가 등록한 피해사례 입니다';
          this.setState({
            cliEvaluList: page === 0 ? resBody.content : [...cliEvaluList, ...resBody.content],
            searchNotice: notice,
            isLastList: resBody.last,
            notExistCEvalu: false,
          });
          return;
        }

        this.setState({ isNewestEvaluList: false, notExistCEvalu: false });
      })
      .catch((ex) => {
        notifyError(
          '내가 등록한 피해사례 요청 문제',
          `내가 등록한 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`,
        );

        this.setState({ notExistCEvalu: false });
      });
  };


  /**
   * 최근 피해사례 요청 함수
   */
  setClinetEvaluList = () => {
    const { user } = this.props;
    const { page, cliEvaluList } = this.state;
    api
      .getClientEvaluList(page, user.uid, false)
      .then((resBody) => {
        if (resBody && resBody.content) {
          let notice;
          if (resBody.content.length === 0) {
            notice = '블랙리스트를 조회 또는 추가해 주세요.';
            this.setState({
              cliEvaluList: [],
              searchNotice: notice,
              isLastList: resBody.last,
              isNewestEvaluList: true,
              notExistCEvalu: false,
            });

            return;
          }
          const beforeTwoMonth = moment()
            .add(-2, 'month')
            .format('MM/DD');
          const now = moment().format('MM/DD');
          notice = `최근[${beforeTwoMonth} ~ ${now}] 리스트 입니다, 평가 및 주의해 주세요.`;

          this.setState({
            isLastList: resBody.last,
            searchNotice: notice,
            isNewestEvaluList: true,
            cliEvaluList: page === 0 ? resBody.content : [...cliEvaluList, ...resBody.content],
            notExistCEvalu: false,
          });

          return;
        }

        this.setState({ notExistCEvalu: false });
      })
      .catch((ex) => {
        notifyError(
          '최근 피해사례 요청 문제',
          `최근 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`,
        );

        this.setState({ notExistCEvalu: false });
      });
  };


  /**
   * 피해사례 필터링 함수
   */
  searchFilterCliEvalu = () => {
    const { searchArea, searchWord } = this.state;

    if (!searchWord) {
      this.setState({
        searchNotice: '검색어를 기입해 주세요!',
      });
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
            notice = `[${searchWord}]는 현재 피해사례에 조회되지 않습니다.`;
            this.setState({
              notExistCEvalu: true,
              isLastList: true,
            });
          }
          this.setState({
            isLastList: true,
            searchedWord: searchWord,
            cliEvaluList: resBody,
            searchNotice: notice,
            searchTime: moment().format('YYYY.MM.DD HH:mm'),
          });
        }
      })
      .catch((ex) => {
        notifyError(
          '피해사례 요청 문제',
          `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`,
        );
      });
  };

  /**
   * 피해사례 업데이트 함수
   */
  openUpdateCliEvaluForm = (item) => {
    this.setState({
      updateEvalu: item,
      isVisibleUpdateModal: true,
    });
  };

  onSearchAreaChange = (itemValue) => {
    if (itemValue === 'TEL') {
      this.setState({ searchArea: itemValue, searchPlaceholder: '전화번호 입력(- 없이)' });
      return;
    }
    if (itemValue === 'FIRM_NUMBER') {
      this.setState({ searchArea: itemValue, searchPlaceholder: '사업자번호 입력(- 포함)' });
      return;
    }
    if (itemValue === 'FIRM_NAME') {
      this.setState({ searchArea: itemValue, searchPlaceholder: '업체명 입력' });
      return;
    }
    if (itemValue === 'CLI_NAME') {
      this.setState({ searchArea: itemValue, searchPlaceholder: '고객명 입력' });
    }
  };

  /**
   * 장비업체리스트 페이징 추가 함수
   */
  handleLoadMore = () => {
    const { page, isLastList, isNewestEvaluList } = this.state;

    if (isLastList) {
      return;
    }

    this.setState(
      {
        page: page + 1,
      },
      () => {
        if (isNewestEvaluList) {
          this.setClinetEvaluList();
        } else {
          this.setMyClinetEvaluList();
        }
      },
    );
  };

  onClickNewestEvaluList = () => {
    this.setState(
      {
        page: 0,
        isNewestEvaluList: true,
      },
      () => {
        this.setClinetEvaluList();
      },
    );
  }

  onClickMyEvaluList = () => {
    this.setState(
      {
        page: 0,
        isNewestEvaluList: false,
      },
      () => {
        this.setMyClinetEvaluList();
      },
    );
  }


  /**
   * 피해사례 아이템 UI 렌더링 함수
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
        openDetailModal={evalu => this.setState({ detailEvalu: evalu, isVisibleDetailModal: true })}
      />
    );
  };

  render() {
    const {
      searchWord,
      searchedWord,
      searchArea,
      searchNotice,
      searchPlaceholder,
      searchTime,
      notExistCEvalu,
      updateEvalu,
      detailEvalu,
      cliEvaluList,
      isLastList,
      evaluLikeList,
      evaluLikeSelected,
      isMineEvaluation,
      isVisibleCreateModal,
      isVisibleUpdateModal,
      isVisibleEvaluLikeModal,
      isVisibleDetailModal,
    } = this.state;
    const { user } = this.props;

    return (
      <View style={styles.Container}>
        <View style={styles.searchHeaderWrap}>
          <View style={styles.searchHeaderTopWrap}>
            <Picker
              selectedValue={searchArea}
              style={styles.searchPicker}
              onValueChange={this.onSearchAreaChange}
            >
              <Picker.Item label="전화번호 검색" value="TEL" />
              <Picker.Item label="사업자번호 검색" value="FIRM_NUMBER" />
              <Picker.Item label="업체명 검색" value="FIRM_NAME" />
              <Picker.Item label="고객명 검색" value="CLI_NAME" />
            </Picker>
            <View style={styles.pickerArrowWrap}>
              <Text style={styles.pickerArrow}>&#9660;</Text>
            </View>
            <View style={styles.commWrap}>
              <JBButton
                title="내 사례"
                onPress={() => this.setMyClinetEvaluList()}
                size="small"
                align="right"
                bgColor={colors.batangDark}
                color={colors.pointDark}
              />
              <JBButton
                title="최근"
                onPress={() => this.onClickNewestEvaluList()}
                size="small"
                align="right"
                bgColor={colors.batangDark}
                color={colors.pointDark}
              />
              <JBButton
                title="추가"
                onPress={() => this.setState({ isVisibleCreateModal: true })}
                size="small"
                align="right"
                bgColor={colors.batangDark}
                color={colors.pointDark}
              />
            </View>
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

        {notExistCEvalu ? (
          <NotExitButWrap>
            <JBButton
              title={`'${searchedWord}' 피해사례 없음 공유`}
              onPress={() => shareNotExistCEvalu(searchArea, searchWord, searchTime)}
              align="center"
              Secondary
            />
          </NotExitButWrap>
        )
          : (
            <FlatList
              data={cliEvaluList}
              renderItem={this.renderCliEvaluItem}
              keyExtractor={(item, index) => index.toString()}
              last={isLastList}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={2}
            />
          )}
        <JangbeeAdList admob admobUnitID="ca-app-pub-9415708670922576/2793380882" admonSize="fullBanner" admonHeight="60" />
        <ClientEvaluCreateModal
          isVisibleModal={isVisibleCreateModal}
          accountId={user.uid}
          closeModal={() => this.setState({ isVisibleCreateModal: false })}
          completeAction={() => this.setClinetEvaluList()}
          size="full"
        />
        <ClientEvaluUpdateModal
          updateEvalu={updateEvalu}
          isVisibleModal={isVisibleUpdateModal}
          closeModal={() => this.setState({ isVisibleUpdateModal: false })}
          completeAction={() => this.setClinetEvaluList()}
        />
        <ClientEvaluDetailModal
          isVisibleModal={isVisibleDetailModal}
          detailEvalu={detailEvalu}
          closeModal={() => this.setState({ isVisibleDetailModal: false })}
          completeAction={() => {}}
          size="full"
        />
        <ClientEvaluLikeModal
          isVisibleModal={isVisibleEvaluLikeModal}
          accountId={user.uid}
          evaluation={evaluLikeSelected}
          evaluLikeList={evaluLikeList}
          createClientEvaluLike={this.createClientEvaluLike}
          cancelClientEvaluLike={this.cancelClientEvaluLike}
          closeModal={refresh => this.closeEvaluLikeModal(refresh)}
          isMine={isMineEvaluation}
        />
      </View>
    );
  }
}

export default withLogin(ClientEvaluScreen);
