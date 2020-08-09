import * as React from 'react';

import { CallHistory, CallHistoryType } from './type';
import { filterCallHistory, searchMyFirmHarmCase } from './searchAction';

import CallLogs from 'react-native-call-log';
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
  const [callHistory, setCallHistory] = React.useState<Array<CallHistory>>([]);
  const [searched, setSearched] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState('');
  const [searchTime, setSearchTime] = React.useState<Date>();
  const [harmCaseList, setHarmCaseList] = React.useState([]);
  const [detailEvalu, setDetailEvalu] = React.useState();
  const [visibleDetailModal, setVisibleDetailModal] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          CallLogs.load(500, {}).then(c => { console.log(c); setCallHistory(c) });
        } else {
          console.log('Call Log permission denied');
        }
      }
      catch (e) {
        console.log(e);
      }
    })();

    // init search
    if (props.searchWord) {
      actions.onSearchWordEndEditing(props.searchWord);
    }

    // Init my search
    if (props.initMyHarmCaseSearch)
    {
      searchMyFirmHarmCase(user.uid)
        .then(resBody =>
        {
          if (resBody && resBody.content)
          {
            setSearched(true);
            setHarmCaseList(resBody.content);
            setSearchWord('내가 등록한 피해사례 입니다');
            return;
          }
        })
        .catch(ex =>
        {
          noticeUserError('내가 등록한 피해사례 요청 문제', `내가 등록한 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
        });
    }
  }, []);

  // Server api call
  // Init Actions
  // Init States
  const states = {
    searched, searchWord, searchTime, detailEvalu,
    visibleDetailModal,
    callHistory: filterCallHistory(callHistory),
    harmCaseList
  };
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
          setHarmCaseList([]);
          noticeUserError('피해사례 요청 문제', `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
        });
    },
    onCancelSearch () {
      setSearched(false);
      setSearchWord(undefined);
      setHarmCaseList([]);
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
            setHarmCaseList([]);
            noticeUserError('피해사례 요청 문제(-> onSearchWordEndEditing)', `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
          });
      }
    },
    openDetailModal: (evalu): void =>
    {
      setDetailEvalu(evalu);
      setVisibleDetailModal(true);
    },
    closeFirmHarmCaseDetailModal: () => {
      setVisibleDetailModal(false);
    }
  };
  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};
export default FirmHarmCaseSearchProvider;