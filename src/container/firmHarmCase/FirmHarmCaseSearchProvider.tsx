import * as React from 'react';

import { CallHistory, CallHistoryType, MY_FIRMHARMCASE_SEARCHWORD } from './type';
import { deleteFirmHarmCase, filterCallHistory, searchMyFirmHarmCase } from './searchAction';

import { DefaultNavigationProps } from 'src/types';
import { PermissionsAndroid } from 'react-native';
import { Provider } from 'src/contexts/FirmHarmCaseSearchContext';
import { formatTelnumber } from 'src/utils/StringUtils';
import { noticeUserError } from '../request';
import { searchFirmHarmCase } from './action';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
  searchWord?: string;
  initMyHarmCaseSearch: boolean;
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

  React.useEffect(() => {
    // init search
    if (props.searchWord) {
      actions.onSearchWordEndEditing(props.searchWord);
    }

    // Init my search
    if (props.initMyHarmCaseSearch)
    {
      searchMyFirmHarmCaseAction();
    }
  }, []);

  // Utils Actions
  const searchMyFirmHarmCaseAction = () => {
    searchMyFirmHarmCase(user.uid)
      .then(resBody =>
      {
        if (resBody && resBody.content)
        {
          setSearched(true);
          setHarmCaseList(resBody.content);
          setSearchWord(MY_FIRMHARMCASE_SEARCHWORD);
          return;
        }
      })
      .catch(ex =>
      {
        noticeUserError('내가 등록한 피해사례 요청 문제', `내가 등록한 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
      });
  }

  // Props States
  const states = {
    searched, searchWord, searchTime, detailEvalu,
    visibleDetailModal,
    callHistory: filterCallHistory(callHistory),
    harmCaseList
  };
  // Props Actions
  const actions = {
    onSelectCallHistory (history: CallHistory) {
      setSearched(true);
      setSearchWord(formatTelnumber(history.phoneNumber));
      searchFirmHarmCase(history.phoneNumber)
        .then((harmcaseList) => {
          setHarmCaseList(harmcaseList);
          setSearchTime(new Date());
        })
        .catch(ex =>
        {
          setHarmCaseList(undefined);
          noticeUserError('피해사례 요청 문제', `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
        });
    },
    onCancelSearch () {
      setSearched(false);
      setSearchWord(undefined);
      setHarmCaseList(undefined);
      setSearchTime(undefined);
    },
    onSearchWordEndEditing (text: string) {
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
    openDetailModal(evalu): void
    {
      setDetailEvalu(evalu);
      setVisibleDetailModal(true);
    },
    closeFirmHarmCaseDetailModal() {
      setVisibleDetailModal(false);
    },
    openUpdateFirmHarmCase(evalu) {
      props.navigation.navigate('FirmHarmCaseUpdate', { harmCase: evalu })
    },
    deleteFirmHarmCase(id: string) {
      deleteFirmHarmCase(id)
        .then(() => {
          if (searchWord === MY_FIRMHARMCASE_SEARCHWORD)
          {
            searchMyFirmHarmCaseAction();
          } else {
            actions.onSearchWordEndEditing(searchWord);
          }
        })
        .catch(error =>
          noticeUserError(
            '피해사례 삭제 문제',
            `피해사례 삭제에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`, user
          )
        );
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};
export default FirmHarmCaseSearchProvider;