import * as React from 'react';

import { CallHistory, MY_FIRMHARMCASE_SEARCHWORD, TOTAL_FIRMHARMCASE_SEARCHWORD } from './type';
import { deleteFirmHarmCase, filterCallHistory, searchMyFirmHarmCase } from './searchAction';

import { DefaultNavigationProps } from 'src/types';
import { FirmHarmCasesQuery } from 'src/api/queries';
import { Provider } from 'src/contexts/FirmHarmCaseSearchContext';
import { formatTelnumber } from 'src/utils/StringUtils';
import { noticeUserError } from '../request';
import { searchFirmHarmCase } from './action';
import { useLazyQuery } from '@apollo/client';
import { useLoginContext } from 'src/contexts/LoginContext';

const PAGING_COUNT = 30;

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
  searchWord?: string;
  initMyHarmCaseSearch: boolean;
  initSearchAll: boolean;
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
  const [firHarmCasesReq, firHarmCasesRsp] = useLazyQuery(FirmHarmCasesQuery);

  console.log('>>> firHarmCasesRsp: ', firHarmCasesRsp?.data?.firmHarmCases?.edges)

  React.useEffect(() =>
  {
    // init search
    if (props.searchWord)
    {
      actions.onSearchWordEndEditing(props.searchWord);
    }

    // Init my search
    if (props.initMyHarmCaseSearch)
    {
      searchMyFirmHarmCaseAction();
    }

    if (props.initSearchAll)
    {
      firHarmCasesReq({ variables: { pageQueryInfo: { first: PAGING_COUNT } } });
      setSearched(true);
      setSearchWord(TOTAL_FIRMHARMCASE_SEARCHWORD);
    }
  }, []);

  // Utils Actions
  const searchMyFirmHarmCaseAction = () =>
  {
    searchMyFirmHarmCase(user.uid)
      .then(resBody =>
      {
        if (resBody && resBody.content)
        {
          setSearched(true);
          setHarmCaseList(resBody.content);
          setSearchWord(MY_FIRMHARMCASE_SEARCHWORD);
        }
      })
      .catch(ex =>
      {
        noticeUserError('내가 등록한 피해사례 요청 문제', `내가 등록한 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
      });
  };

  // Props States
  const states = {
    searched, searchWord, searchTime, detailEvalu,
    visibleDetailModal,
    callHistory: filterCallHistory(callHistory),
    harmCaseList: firHarmCasesRsp?.data?.firmHarmCases?.edges || []
  };
  // Props Actions
  const actions = {
    onSelectCallHistory (history: CallHistory): void
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
    onCancelSearch (): void
    {
      setSearched(false);
      setSearchWord(undefined);
      setHarmCaseList(undefined);
      setSearchTime(undefined);
    },
    onSearchWordEndEditing (text: string): void
    {
      if (text)
      {
        setSearched(true);
        setSearchWord(text);
        searchFirmHarmCase(text)
          .then((harmcaseList) => {
            setSearchTime(new Date());
            harmcaseList ? setHarmCaseList(harmcaseList) : setHarmCaseList([]);
          })
          .catch(ex =>
          {
            setHarmCaseList(undefined);
            noticeUserError('피해사례 요청 문제(-> onSearchWordEndEditing)', `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
          });
      }
    },
    openDetailModal (evalu): void
    {
      setDetailEvalu(evalu);
      setVisibleDetailModal(true);
    },
    closeFirmHarmCaseDetailModal ()
    {
      setVisibleDetailModal(false);
    },
    openUpdateFirmHarmCase (evalu): void
    {
      props.navigation.navigate('FirmHarmCaseUpdate', { harmCase: evalu })
    },
    deleteFirmHarmCase (id: string): void
    {
      deleteFirmHarmCase(id)
        .then(() => {
          if (searchWord === MY_FIRMHARMCASE_SEARCHWORD)
          {
            searchMyFirmHarmCaseAction();
          }
          else
          {
            actions.onSearchWordEndEditing(searchWord);
          }
        })
        .catch(error =>
          noticeUserError(
            '피해사례 삭제 문제',
            `피해사례 삭제에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`, user
          )
        );
    },
    onEndReachedCaseList (): void
    {
      if (!firHarmCasesRsp?.data?.firmHarmCases?.pageInfo?.hasNextPage) { return }
      firHarmCasesRsp.fetchMore(
        {
          variables: {
            pageQueryInfo:
            {
              first: PAGING_COUNT,
              after: firHarmCasesRsp.data.firmHarmCases.pageInfo.endCursor
            }
          },
          updateQuery: (previousResult, { fetchMoreResult }) =>
          {
            const newEdges = fetchMoreResult.firmHarmCases.edges;
            const pageInfo = fetchMoreResult.firmHarmCases.pageInfo;

            return newEdges.length
              ? {
                // Put the new comments at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                firmHarmCases: {
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
