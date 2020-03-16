import * as api from 'api/api';

import ClientEvaluCreateModal from 'templates/ClientEvaluCreateModal';
import ClientEvaluDetailModal from 'templates/ClientEvaluDetailModal';
import ClientEvaluLikeModal from 'templates/ClientEvaluLikeModal';
import ClientEvaluUpdateModal from 'templates/ClientEvaluUpdateModal';
import { DefaultNavigationProps } from 'src/types';
import FirmHarmCaseLayout from '../components/templates/FirmHarmCaseLayout';
import React from 'react';
import moment from 'moment';
import { notifyError } from 'common/ErrorNotice';
import { shareNotExistCEvalu } from 'common/JBCallShare';
import styled from 'styled-components/native';
import { useLoginProvider } from 'src/contexts/LoginProvider';

const Container = styled.SafeAreaView`
  flex: 1;
`;

interface Props {
  navigation: DefaultNavigationProps;
}
function FirmHarmCaseScreen (props): React.ReactElement
{
  const { user } = useLoginProvider();
  const [visibleCreateModal, setVisibleCreateModal] = React.useState(false);
  const [visibleUpdateModal, setVisibleUpdateModal] = React.useState(false);
  const [visibleDetailModal, setVisibleDetailModal] = React.useState(false);
  const [visibleEvaluLikeModal, setVisibleEvaluLikeModal] = React.useState(false);
  const [cliEvaluList, setCliEvaluList] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [lastList, setLastList] = React.useState(false);
  const [newestEvaluList, setNewestEvaluList] = React.useState(false);
  const [evaluLikeList, setEvaluLikeList] = React.useState([]);
  const [searchWord, setSearchWord] = React.useState('');
  const [searchArea, setSearchArea] = React.useState('TEL');
  const [searchTime, setSearchTime] = React.useState();
  const [searchNotice, setSearchNotice] = React.useState('');
  const [countData, setCountData] = React.useState();
  const [updateEvalu, setUpdateEvalu] = React.useState();
  const [evaluLikeSelected, setEvaluLikeSelected] = React.useState();
  const [mineEvaluation, setMineEvaluation] = React.useState();
  const [detailEvalu, setDetailEvalu] = React.useState();

  React.useEffect(() =>
  {
    const { params } = props.navigation.state;

    if (params && params.search)
    {
      setSearchArea('TEL');
      setSearchWord(params.search);
      searchFilterCliEvalu(params.search);
    }
    else
    {
      getClientEvaluCount(user.uid, setCountData);
      setClinetEvaluList();
    }
  }, []);

  const deleteCliEvalu = (id) =>
  {
    api
      .deleteCliEvalu(id)
      .then(() => setClinetEvaluList())
      .catch(error =>
        notifyError(
          '피해사례 삭제 문제',
          `피해사례 삭제에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`
        )
      );
  };

  /**
   * 최근 피해사례 요청 함수
   */
  const setClinetEvaluList = () =>
  {
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
            setCliEvaluList([]);
            setSearchNotice(notice);
            setLastList(resBody.last);
            setNewestEvaluList(true);

            return;
          }
          const beforeTwoMonth = moment()
            .add(-2, 'month')
            .format('MM/DD');
          const now = moment().format('MM/DD');
          notice = `최근[${beforeTwoMonth} ~ ${now}] 리스트 입니다, 평가 및 주의해 주세요.`;
          setLastList(resBody.last);
          setSearchNotice(notice);
          setNewestEvaluList(true);
          setCliEvaluList(
            page === 0
              ? resBody.content
              : [...cliEvaluList, ...resBody.content]);
          setSearchTime(moment().format('YYYY.MM.DD HH:mm'));
        }
      })
      .catch(ex =>
      {
        notifyError(
          '최근 피해사례 요청 문제',
          `최근 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`
        );
      });
  };

  /**
   * 공감/비공감 API 요청 함수
   *
   * @param {object} newEvaluLike 공감/비공감 추가할 데이터
   */
  const createClientEvaluLike = newEvaluLike =>
  {
    api
      .createClientEvaluLike(newEvaluLike)
      .then(() =>
      {
        setCliEvaluLikeList(newEvaluLike.evaluId);
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
  const openCliEvaluLikeModal = (item, isMine) =>
  {
    setEvaluLikeSelected(item);
    setMineEvaluation(isMine);
    setVisibleEvaluLikeModal(true);

    setCliEvaluLikeList(item.id);
  };

  /**
   * 피해사례 평가 데이터 설정 함수
   */
  const setCliEvaluLikeList = evaluId =>
  {
    api
      .getClientEvaluLikeList(evaluId)
      .then(resBody =>
      {
        setEvaluLikeList(resBody);
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
  const cancelClientEvaluLike = (evaluation, like) =>
  {
    api
      .deleteCliEvaluLike(evaluation.id, user.uid, like)
      .then(() => setCliEvaluLikeList(evaluation.id))
      .catch(error =>
        notifyError(
          '공감/비공감 취소 문제',
          `피해사례 공감/비공감 취소 요청에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`
        )
      );
  };

  const closeEvaluLikeModal = (refresh) =>
  {
    if (refresh)
    {
      setClinetEvaluList();
    }
    setVisibleEvaluLikeModal(false);
  };

  /**
   * 내가 등록한 피해사례 요청 함수
   */
  const setMyClientEvaluList = () =>
  {
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
            setCliEvaluList([]);
            setSearchNotice(notice);
            setLastList(resBody.last);
            return;
          }

          notice = '내가 등록한 피해사례 입니다';
          setCliEvaluList(
            page === 0
              ? resBody.content
              : [...cliEvaluList, ...resBody.content]);
          setSearchNotice(notice);
          setLastList(resBody.last);
          setSearchTime(moment().format('YYYY.MM.DD HH:mm'));
          return;
        }

        setNewestEvaluList(false);
      })
      .catch(ex =>
      {
        notifyError(
          '내가 등록한 피해사례 요청 문제',
          `내가 등록한 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`
        );
      });
  };

  /**
   * 피해사례 필터링 함수
   */
  const searchFilterCliEvalu = (searchWord: string): void =>
  {
    if (!searchWord)
    {
      setSearchNotice('검색어를 기입해 주세요!');
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
      const pNumber = searchWord.split('-').join('');
      paramStr = `telNumber=${pNumber}`;
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
          }
          setSearchWord(searchWord);
          setCliEvaluList(resBody);
          setSearchNotice(notice);
          setSearchTime(moment().format('YYYY.MM.DD HH:mm'));
          setLastList(true);
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
  const openUpdateCliEvaluForm = item =>
  {
    setUpdateEvalu(item);
    setVisibleUpdateModal(true);
  };

  const openDetailModal = (evalu): void =>
  {
    setDetailEvalu(evalu);
    setVisibleDetailModal(true);
  };

  /**
   * 장비업체리스트 페이징 추가 함수
   */
  const handleLoadMore = () =>
  {
    if (lastList)
    {
      return;
    }
    setPage(page + 1);
    if (newestEvaluList)
    {
      setClinetEvaluList();
    }
    else
    {
      setMyClientEvaluList();
    }
  };

  const onClickNewestEvaluList = () =>
  {
    setPage(0);
    setNewestEvaluList(true);
    setCliEvaluList(null);
    setClinetEvaluList();
  };

  const onClickMyEvaluList = () =>
  {
    setPage(0);
    setNewestEvaluList(false);
    setCliEvaluList(null);
    setMyClientEvaluList();
  };

  const layoutProps = {
    searchArea,
    searchWord,
    searchNotice,
    countData,
    handleLoadMore,
    setSearchArea,
    setSearchWord,
    onClickMyEvaluList,
    onClickNewestEvaluList,
    setVisibleCreateModal,
    searchFilterCliEvalu,
    shareNotExistCEvalu,
    openUpdateCliEvaluForm,
    openDetailModal,
    deleteCliEvalu,
    openCliEvaluLikeModal,
    setNewestEvaluList
  };

  return (
    <Container>
      <FirmHarmCaseLayout
        list={cliEvaluList}
        {...layoutProps}
      />

      <ClientEvaluCreateModal
        isVisibleModal={visibleCreateModal}
        accountId={user.uid}
        closeModal={() => setVisibleCreateModal(false)}
        completeAction={() => setClinetEvaluList()}
        size="full"
      />
      <ClientEvaluUpdateModal
        updateEvalu={updateEvalu}
        isVisibleModal={visibleUpdateModal}
        closeModal={() => setVisibleUpdateModal(false)}
        completeAction={() => setClinetEvaluList()}
      />
      <ClientEvaluDetailModal
        isVisibleModal={visibleDetailModal}
        detailEvalu={detailEvalu}
        closeModal={() => setVisibleDetailModal(false)}
        completeAction={() => {}}
        size="full"
        searchTime={searchTime}
      />
      <ClientEvaluLikeModal
        isVisibleModal={visibleEvaluLikeModal}
        accountId={user.uid}
        evaluation={evaluLikeSelected}
        evaluLikeList={evaluLikeList}
        createClientEvaluLike={createClientEvaluLike}
        cancelClientEvaluLike={cancelClientEvaluLike}
        closeModal={refresh => closeEvaluLikeModal(refresh)}
        isMine={mineEvaluation}
      />
    </Container>
  );
}

FirmHarmCaseScreen.navigationOptions = ({ navigation }) => ({
  title: '피해사례 고객',
  headerStyle: {
    marginTop: -28
  }
});

const getClientEvaluCount = (accountId: string, setCountData: (n: string) => void) =>
{
  api
    .getClientEvaluCount(accountId)
    .then(countData =>
    {
      if (countData)
      {
        setCountData(countData);
      }
    })
    .catch(ex =>
    {
      notifyError(
        '피해사례 통계 요청',
        `피해사례 통계 요처에 문제가 있습니다, 다시 시도해 주세요${ex.message}`
      );
    });
};

export default FirmHarmCaseScreen;
