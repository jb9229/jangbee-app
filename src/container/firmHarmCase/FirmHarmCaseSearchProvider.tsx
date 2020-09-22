import * as React from 'react';

import { CallHistory, MY_FIRMHARMCASE_SEARCHWORD, TOTAL_FIRMHARMCASE_SEARCHWORD } from './type';
import { useLazyQuery, useMutation } from '@apollo/client';

import { DefaultNavigationProps } from 'src/types';
import { FIRMHARMCASE_DELETE } from 'src/api/mutations';
import { FirmHarmCasesQuery } from 'src/api/queries';
import { Provider } from 'src/contexts/FirmHarmCaseSearchContext';
import { filterCallHistory } from './searchAction';
import { formatTelnumber } from 'src/utils/StringUtils';
import { noticeUserError } from '../request';
import { searchFirmHarmCase } from './action';
import { useLoginContext } from 'src/contexts/LoginContext';

const PAGING_COUNT = 30;

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
  searchWord?: string;
  initSearch: string;
  initSearchAll: boolean;
  initSearchMine: boolean;
}
const FirmHarmCaseSearchProvider = (props: Props): React.ReactElement =>
{
  // states
  const { user } = useLoginContext();
  const [callHistory, setCallHistory] = React.useState<Array<CallHistory>>();
  const [searched, setSearched] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState('');
  const [searchTime, setSearchTime] = React.useState<Date>();
  const [harmCaseList, setHarmCaseList] = React.useState();
  const [detailEvalu, setDetailEvalu] = React.useState();
  const [visibleDetailModal, setVisibleDetailModal] = React.useState(false);
  const [searchQueryVariables] = React.useState(
    { firmCaseListInput: { accountId: '', searchWord: '', pageQueryInfo: { first: PAGING_COUNT } } });
  const [firHarmCasesReq, firHarmCasesRsp] = useLazyQuery(FirmHarmCasesQuery, {
    notifyOnNetworkStatusChange: true
  });
  const [deleteRequest, deleteResponse] = useMutation(FIRMHARMCASE_DELETE, {
    onCompleted: (data) =>
    {
      firHarmCasesRsp.refetch();
    },
    onError: (err) => { noticeUserError('FirmHarmCaseSearchProvider(deleteRequest -> error)', err?.message, user) }
  });

  console.log('>>> firHarmCasesRsp: ', firHarmCasesRsp?.data?.firmHarmCases?.edges);

  React.useEffect(() =>
  {
    // init search
    if (props.searchWord)
    {
      actions.onSearchWordEndEditing(props.searchWord);
    }

    if (props.initSearchAll)
    {
      firHarmCasesReq({ variables: searchQueryVariables });
      setSearched(true);
      setSearchWord(TOTAL_FIRMHARMCASE_SEARCHWORD);
    }
    else if (props.initSearchMine)
    {
      searchQueryVariables.firmCaseListInput.accountId = user.uid;
      firHarmCasesReq({ variables: searchQueryVariables });
      setSearched(true);
      setSearchWord(MY_FIRMHARMCASE_SEARCHWORD);
    }
    else if (props.initSearch)
    {
      searchQueryVariables.firmCaseListInput.searchWord = props.initSearch;
      firHarmCasesReq({ variables: searchQueryVariables });
      setSearched(true);
      setSearchWord(props.initSearch);
    }
  }, []);

  // Props States
  const states = {
    searched, searchWord, searchTime, detailEvalu,
    visibleDetailModal,
    callHistory: filterCallHistory(callHistory),
    harmCaseList: firHarmCasesRsp?.data?.firmHarmCases?.edges || [],
    loading: firHarmCasesRsp.loading
  };
  // Props Actions
  const actions = {
    onSelectCallHistory(history: CallHistory): void
    {
      setSearched(true);
      setSearchWord(formatTelnumber(history.phoneNumber));
      searchFirmHarmCase(history.phoneNumber)
        .then((harmcaseList) =>
        {
          setHarmCaseList(harmcaseList);
          setSearchTime(new Date());
        })
        .catch(ex =>
        {
          setHarmCaseList(undefined);
          noticeUserError('피해사례 요청 문제', `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
        });
    },
    onCancelSearch(): void
    {
      searchQueryVariables.firmCaseListInput.accountId = '';
      setSearched(false);
      setSearchWord(undefined);
      setHarmCaseList(undefined);
      setSearchTime(undefined);
    },
    onSearchWordEndEditing(text: string): void
    {
      if (text)
      {
        setSearched(true);
        setSearchWord(text);
        searchQueryVariables.firmCaseListInput.searchWord = text;
        console.log('>>> searchQueryVariables: ', searchQueryVariables);
        firHarmCasesReq({ variables: { ...searchQueryVariables } });
      }
    },
    openDetailModal(evalu): void
    {
      setDetailEvalu(evalu);
      setVisibleDetailModal(true);
    },
    closeFirmHarmCaseDetailModal()
    {
      setVisibleDetailModal(false);
    },
    openUpdateFirmHarmCase(evalu): void
    {
      props.navigation.navigate('FirmHarmCaseUpdate', { harmCase: evalu });
    },
    deleteFirmHarmCase(id: string): void
    {
      console.log('>>> delete firmharmcase id: ', id);
      deleteRequest({ variables: { id: id } });
    },
    onEndReachedCaseList(): void
    {
      if (!firHarmCasesRsp?.data?.firmHarmCases?.pageInfo?.hasNextPage) { return }

      firHarmCasesRsp.fetchMore(
        {
          variables: { cursor: firHarmCasesRsp.data.firmHarmCases.pageInfo.endCursor },
          updateQuery: (previousResult, { fetchMoreResult }) =>
          {
            const newEdges = fetchMoreResult.firmHarmCases.edges;
            const pageInfo = fetchMoreResult.firmHarmCases.pageInfo;

            return newEdges.length
              ? {
                // Put the new comments at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                firmHarmCases:
                {
                  __typename: previousResult.firmHarmCases.__typename,
                  edges: [...previousResult.firmHarmCases.edges, ...newEdges],
                  pageInfo
                }
              }
              : previousResult;
          }
        }
      );
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};
export default FirmHarmCaseSearchProvider;
