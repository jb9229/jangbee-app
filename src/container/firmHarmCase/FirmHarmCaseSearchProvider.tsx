import * as React from 'react';

import { CallHistory, CallHistoryType } from './type';

import CallLogs from 'react-native-call-log';
import { DefaultNavigationProps } from 'src/types';
import { PermissionsAndroid } from 'react-native';
import { Provider } from 'src/contexts/FirmHarmCaseSearchContext';
import { formatTelnumber } from 'src/utils/StringUtils';
import { noticeUserError } from '../request';
import { searchFirmHarmCase } from './action';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseSearchProvider = (props: Props): React.ReactElement =>
{
  // states
  const [callHistory, setCallHistory] = React.useState<Array<CallHistory>>([]);
  const [searched, setSearched] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState('');
  const [harmCaseList, setHarmCaseList] = React.useState([]);

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
    })()
  }, []);

  // Server api call
  // Init Actions
  // Init States
  const states = {
    searched, searchWord,
    callHistory: callHistory.filter((history) => history.rawType !== CallHistoryType.OUTGOING),
    harmCaseList
  };
  const actions = {
    onSelectCallHistory (history: CallHistory) {
      setSearched(true);
      setSearchWord(formatTelnumber(history.phoneNumber));
      searchFirmHarmCase(history.phoneNumber)
        .then((harmcaseList) => {
          setHarmCaseList(harmcaseList);
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
    },
    onSearchWordEndEditing (text: string) {
      if (text)
      {
        setSearched(true);
        setSearchWord(text);
        console.log('>>> text: ', text)
        searchFirmHarmCase(text)
          .then((harmcaseList) => {
            harmcaseList ? setHarmCaseList(harmcaseList) : setHarmCaseList([]);
          })
          .catch(ex =>
          {
            setHarmCaseList([]);
            noticeUserError('피해사례 요청 문제(-> onSearchWordEndEditing)', `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
          });
      }
    }
  };
  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};
export default FirmHarmCaseSearchProvider;