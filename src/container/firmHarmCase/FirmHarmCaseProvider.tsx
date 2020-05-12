import * as React from 'react';
import * as api from 'api/api';

import { DefaultNavigationProps, FirmHarmCaseCountData } from 'src/types';

import { Provider } from 'src/contexts/FirmHarmCaseContext';
import { getClientEvaluCount } from 'src/container/firmHarmCase/action';
import moment from 'moment';
import { notifyError } from 'common/ErrorNotice';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const FirmHarmCaseProvider = (props: Props): React.ReactElement =>
{
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
      getClientEvaluCount(user?.uid, setCountData);
      setClinetEvaluList();
    }
  }, []);

  const { user } = useLoginContext();
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
  const [searchTime, setSearchTime] = React.useState('');
  const [searchNotice, setSearchNotice] = React.useState('');
  const [countData, setCountData] = React.useState<FirmHarmCaseCountData>();
  const [updateEvalu, setUpdateEvalu] = React.useState();
  const [evaluLikeSelected, setEvaluLikeSelected] = React.useState();
  const [mineEvaluation, setMineEvaluation] = React.useState();
  const [detailEvalu, setDetailEvalu] = React.useState();
  const [chatMessge, setChatMessge] = React.useState(InitChatMessage);

  // Init States
  const states = {
    user, searchWord, searchNotice, searchArea,
    cliEvaluList, countData,
    visibleCreateModal, setVisibleCreateModal, visibleUpdateModal, visibleDetailModal, visibleEvaluLikeModal,
    updateEvalu, detailEvalu, searchTime,
    evaluLikeSelected, evaluLikeList,
    chatMessge
  };

  // Init Actions
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

  const setCliEvaluLikeList = (evaluId) =>
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

  const actions = {
    deleteCliEvalu: (id: string): void =>
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
    },
    setClinetEvaluList,
    createClientEvaluLike: (newEvaluLike) =>
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
    },
    openCliEvaluLikeModal: (item, isMine) =>
    {
      setEvaluLikeSelected(item);
      setMineEvaluation(isMine);
      setVisibleEvaluLikeModal(true);

      setCliEvaluLikeList(item.id);
    },
    setCliEvaluLikeList,
    cancelClientEvaluLike: (evaluation, like) =>
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
    },
    closeEvaluLikeModal: (refresh) =>
    {
      if (refresh)
      {
        setClinetEvaluList();
      }
      setVisibleEvaluLikeModal(false);
    },
    setMyClientEvaluList,
    searchFilterCliEvalu,
    openUpdateCliEvaluForm: (item) =>
    {
      setUpdateEvalu(item);
      setVisibleUpdateModal(true);
    },
    openDetailModal: (evalu): void =>
    {
      setDetailEvalu(evalu);
      setVisibleDetailModal(true);
    },
    onClickMyEvaluList: () =>
    {
      setPage(0);
      setNewestEvaluList(false);
      setCliEvaluList(null);
      setMyClientEvaluList();
    },
    handleLoadMore: () =>
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
    },
    onClickNewestEvaluList: () =>
    {
      setPage(0);
      setNewestEvaluList(true);
      setCliEvaluList(null);
      setClinetEvaluList();
    },
    getClientEvaluCount: (accountId: string, setCountData: (n: string) => void) =>
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
    },
    senChatMessage: (message: string) =>
    {
      console.log('>>> message', message);
      const newChatMessage = message.concat(
        states.chatMessge
      );
      console.log('>>> newChatMessage', newChatMessage);
      setChatMessge(newChatMessage);
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export default FirmHarmCaseProvider;

const InitChatMessage = [
  {
    _id: 1,
    text: '저도 피해봤습니다',
    createdAt: new Date(Date.UTC(2020, 3, 2, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/img/jangbee_photo_%2B1559951300248.jpg'
    }
  },
  {
    _id: 2,
    text: '우리함께 힘을 합처봐요',
    createdAt: new Date(Date.UTC(2020, 3, 2, 17, 30, 0)),
    user: {
      _id: 1,
      name: 'React Native',
      avatar: 'https://placeimg.com/140/140/any'
    }
  },
  {
    _id: 3,
    text: '두줄로 글써보자 \n 그래그래',
    createdAt: new Date(Date.UTC(2020, 3, 2, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/img/jangbee_photo_%2B1561127267339.jpg'
    }
  }
];
