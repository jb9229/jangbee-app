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

const FirmHarmCaseSBProvider = (props: Props): React.ReactElement =>
{
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

  // Init States
  const states = {
    user, searchWord, searchNotice, searchArea,
    cliEvaluList: [
      {
        accountId: 'test_accountId', reason: 'temp_reason',
        local: '지역', likeCount: 4, unlikeCount: 5, firmName: '업체명',
        cliName: '평가하는 고객', telNumber: '0101111111',
        telNumber2: '0101111111', telNumber3: '0101111111'
      },
      {
        accountId: 'test_accountId', reason: 'temp_reason',
        local: '지역', likeCount: 4, unlikeCount: 5, firmName: '업체명',
        cliName: '평가하는 고객', telNumber: '0101111111',
        telNumber2: '0101111111', telNumber3: '0101111111'
      }
    ],
    countData,
    visibleCreateModal, setVisibleCreateModal, visibleUpdateModal, visibleDetailModal, visibleEvaluLikeModal,
    updateEvalu, detailEvalu, searchTime,
    evaluLikeSelected, evaluLikeList
  };

  // Init Actions
  const setClinetEvaluList = () =>
  {
  };

  const setCliEvaluLikeList = (evaluId) =>
  {
  };

  const setMyClientEvaluList = () =>
  {
  };

  const searchFilterCliEvalu = (searchWord: string): void =>
  {
  };

  const actions = {
    deleteCliEvalu: (id: string) =>
    {
    },
    setClinetEvaluList,
    createClientEvaluLike: (newEvaluLike) =>
    {
    },
    openCliEvaluLikeModal: (item, isMine) =>
    {
    },
    setCliEvaluLikeList,
    cancelClientEvaluLike: (evaluation, like) =>
    {
    },
    closeEvaluLikeModal: (refresh) =>
    {
    },
    setMyClientEvaluList,
    searchFilterCliEvalu,
    openUpdateCliEvaluForm: (item) =>
    {
    },
    openDetailModal: (evalu): void =>
    {
    },
    onClickMyEvaluList: () =>
    {
    },
    handleLoadMore: () =>
    {
    },
    onClickNewestEvaluList: () =>
    {
    },
    getClientEvaluCount: (accountId: string, setCountData: (n: string) => void) =>
    {
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export default FirmHarmCaseSBProvider;

export const FirmHarmCaseObj =
  {
    accountId: 'test_accountId', reason: 'temp_reason',
    local: '지역', likeCount: 4, unlikeCount: 5, firmName: '업체명',
    cliName: '평가하는 고객', telNumber: '0101111111'
  };
