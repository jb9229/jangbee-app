import * as api from 'api/api';

import { FlatList, Picker, StyleSheet, Text, View } from 'react-native';

import ClientEvaluCreateModal from 'templates/ClientEvaluCreateModal';
import ClientEvaluDetailModal from 'templates/ClientEvaluDetailModal';
import ClientEvaluLikeModal from 'templates/ClientEvaluLikeModal';
import ClientEvaluUpdateModal from 'templates/ClientEvaluUpdateModal';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import moment from 'moment';
import { notifyError } from 'common/ErrorNotice';
import { shareNotExistCEvalu } from 'common/JBCallShare';
import styled from 'styled-components/native';
import { withLogin } from 'src/contexts/LoginContext';

class ClientEvaluScreen extends React.Component
{
  static navigationOptions = {
    title: '피해사례 고객'
  };

  componentDidMount ()
  {
    const { params } = this.props.navigation.state;

    if (params && params.search)
    {
      this.setState({ searchArea: 'TEL', searchWord: params.search }, () =>
      {
        this.searchFilterCliEvalu();
      });
    }
    else
    {
      this.setClinetEvaluList();
    }
  }

  componentWillReceiveProps (nextProps)
  {
    if (!nextProps.navigation)
    {
      return;
    }
    const { params } = nextProps.navigation.state;

    if (params && params.search)
    {
      this.setState({ searchArea: 'TEL', searchWord: params.search }, () =>
      {
        this.searchFilterCliEvalu();
      });
    }
  }

  deleteCliEvalu = id =>
  {
    api
      .deleteCliEvalu(id)
      .then(() => this.setClinetEvaluList())
      .catch(error =>
        notifyError(
          '피해사례 삭제 문제',
          `피해사례 삭제에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`
        )
      );
  };

  /**
   * 공감/비공감 API 요청 함수
   *
   * @param {object} newEvaluLike 공감/비공감 추가할 데이터
   */
  createClientEvaluLike = newEvaluLike =>
  {
    api
      .createClientEvaluLike(newEvaluLike)
      .then(() =>
      {
        this.setCliEvaluLikeList(newEvaluLike.evaluId);
      })
      .catch(error =>
        notifyError(
          '공감/비공감 요청 문제',
          `요청에 문제가 있습니다, 다시 시도해 주세요${error.message}`
        )
      );
  };

  /**
   * 피해사례 평가 팝업 오픈
   *
   */
  openCliEvaluLikeModal = (item, isMine) =>
  {
    this.setState({
      evaluLikeSelected: item,
      isMineEvaluation: isMine,
      isVisibleEvaluLikeModal: true
    });

    this.setCliEvaluLikeList(item.id);
  };

  /**
   * 피해사례 평가 데이터 설정 함수
   */
  setCliEvaluLikeList = evaluId =>
  {
    api
      .getClientEvaluLikeList(evaluId)
      .then(resBody =>
      {
        this.setState({ evaluLikeList: resBody });
      })
      .catch(error =>
        notifyError(
          '피해사례 공감 조회 문제',
          `공감 조회에 문제가 있습니다, 다시 시도해 주세요(${error.message})`
        )
      );
  };

  /**
   * 공감/비공감 삭제 함수
   *
   * @param {string} accountId 공감/비공감 삭제할 계정 아이디
   */
  cancelClientEvaluLike = (evaluation, like) =>
  {
    const { user } = this.props;
    api
      .deleteCliEvaluLike(evaluation.id, user.uid, like)
      .then(() => this.setCliEvaluLikeList(evaluation.id))
      .catch(error =>
        notifyError(
          '공감/비공감 취소 문제',
          `피해사례 공감/비공감 취소 요청에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`
        )
      );
  };

  closeEvaluLikeModal = refresh =>
  {
    if (refresh)
    {
      this.setClinetEvaluList();
    }
    this.setState({ isVisibleEvaluLikeModal: false });
  };

  /**
   * 내가 등록한 피해사례 요청 함수
   */
  setMyClinetEvaluList = () =>
  {
    const { user } = this.props;
    const { page, cliEvaluList } = this.state;

    api
      .getClientEvaluList(page, user.uid, true)
      .then(resBody =>
      {
        if (resBody && resBody.content)
        {
          let notice;
          if (resBody.content.length === 0)
          {
            notice = '내가 등록한 피해사례가 없습니다.';
            this.setState({
              cliEvaluList: [],
              searchNotice: notice,
              isLastList: resBody.last,
              notExistCEvalu: false
            });

            return;
          }

          notice = '내가 등록한 피해사례 입니다';
          this.setState({
            cliEvaluList:
              page === 0
                ? resBody.content
                : [...cliEvaluList, ...resBody.content],
            searchNotice: notice,
            isLastList: resBody.last,
            notExistCEvalu: false,
            searchTime: moment().format('YYYY.MM.DD HH:mm')
          });
          return;
        }

        this.setState({ isNewestEvaluList: false, notExistCEvalu: false });
      })
      .catch(ex =>
      {
        notifyError(
          '내가 등록한 피해사례 요청 문제',
          `내가 등록한 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`
        );

        this.setState({ notExistCEvalu: false });
      });
  };

  /**
   * 최근 피해사례 요청 함수
   */
  setClinetEvaluList = () =>
  {
    const { user } = this.props;
    const { page, cliEvaluList } = this.state;
    api
      .getClientEvaluList(page, user.uid, false)
      .then(resBody =>
      {
        if (resBody && resBody.content)
        {
          let notice;
          if (resBody.content.length === 0)
          {
            notice = '블랙리스트를 조회 또는 추가해 주세요.';
            this.setState({
              cliEvaluList: [],
              searchNotice: notice,
              isLastList: resBody.last,
              isNewestEvaluList: true,
              notExistCEvalu: false
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
            cliEvaluList:
              page === 0
                ? resBody.content
                : [...cliEvaluList, ...resBody.content],
            notExistCEvalu: false,
            searchTime: moment().format('YYYY.MM.DD HH:mm')
          });

          return;
        }

        this.setState({ notExistCEvalu: false });
      })
      .catch(ex =>
      {
        notifyError(
          '최근 피해사례 요청 문제',
          `최근 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`
        );

        this.setState({ notExistCEvalu: false });
      });
  };

  /**
   * 피해사례 필터링 함수
   */
  searchFilterCliEvalu = () =>
  {
    const { searchArea, searchWord } = this.state;

    if (!searchWord)
    {
      this.setState({
        searchNotice: '검색어를 기입해 주세요!'
      });
      return;
    }

    let paramStr;

    if (searchArea === 'CLI_NAME')
    {
      paramStr = `cliName=${searchWord}`;
    }

    if (searchArea === 'FIRM_NAME')
    {
      paramStr = `firmName=${searchWord}`;
    }

    if (searchArea === 'TEL')
    {
      paramStr = `telNumber=${searchWord}`;
    }

    if (searchArea === 'FIRM_NUMBER')
    {
      paramStr = `firmNumber=${searchWord}`;
    }

    api
      .searchClientEvaluList(paramStr)
      .then(resBody =>
      {
        if (resBody)
        {
          let notice = '';
          if (resBody.length === 0)
          {
            notice = `[${searchWord}]는 현재 피해사례에 조회되지 않습니다.`;
            this.setState({
              notExistCEvalu: true,
              isLastList: true
            });
          }
          this.setState({
            isLastList: true,
            searchedWord: searchWord,
            cliEvaluList: resBody,
            searchNotice: notice,
            searchTime: moment().format('YYYY.MM.DD HH:mm')
          });
        }
      })
      .catch(ex =>
      {
        notifyError(
          '피해사례 요청 문제',
          `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`
        );
      });
  };

  /**
   * 피해사례 업데이트 함수
   */
  openUpdateCliEvaluForm = item =>
  {
    this.setState({
      updateEvalu: item,
      isVisibleUpdateModal: true
    });
  };

  /**
   * 장비업체리스트 페이징 추가 함수
   */
  handleLoadMore = () =>
  {
    const { page, isLastList, isNewestEvaluList } = this.state;

    if (isLastList)
    {
      return;
    }

    this.setState(
      {
        page: page + 1
      },
      () =>
      {
        if (isNewestEvaluList)
        {
          this.setClinetEvaluList();
        }
        else
        {
          this.setMyClinetEvaluList();
        }
      }
    );
  };

  onClickNewestEvaluList = () =>
  {
    this.setState(
      {
        page: 0,
        isNewestEvaluList: true
      },
      () =>
      {
        this.setClinetEvaluList();
      }
    );
  };

  onClickMyEvaluList = () =>
  {
    this.setState(
      {
        page: 0,
        isNewestEvaluList: false
      },
      () =>
      {
        this.setMyClinetEvaluList();
      }
    );
  };

  render ()
  {
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
      isVisibleDetailModal
    } = this.state;
    const { user } = this.props;

    return (
      <View>
        <Text>To be deleted</Text>
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
          closeModal={() => setVisibleDetailModal(false)}
          completeAction={() => {}}
          size="full"
          searchTime={searchTime}
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

export default ClientEvaluScreen;
