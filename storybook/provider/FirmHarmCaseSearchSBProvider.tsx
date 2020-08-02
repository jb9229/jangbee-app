import * as React from 'react';

import { DefaultNavigationProps, FirmHarmCaseCountData } from 'src/types';

import { BackHandler } from 'react-native';
import { CallHistory } from 'src/container/firmHarmCase/type';
import { Provider } from 'src/contexts/FirmHarmCaseSearchContext';
import { formatTelnumber } from 'src/utils/StringUtils';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseSearchSBProvider = (props: Props): React.ReactElement =>
{
  React.useEffect(() => {
    // android back button listener
    const onBackbutton = (): boolean => { return true };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackbutton);

    return (): void => backHandler.remove();
  }, []);

  const [backButtonCondition] = React.useState({});
  const callHistory = [{rawType: 0, type: 'INCOMING', dateTime: 'FSKESLF', timestamp: '123214324', name: '', duration: 123, phoneNumber: '0102345678' }];
  const initHarmCaseList = [];
  const [harmCaseList, setHarmCaseList] = React.useState(initHarmCaseList);
  const [searched, setSearched] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState('');

  // Server api call
  // Init Actions
  // Init States
  const states = {
    searched,
    searchWord,
    callHistory,
    // harmCaseList: []
    harmCaseList
  };
  const actions = {
    onSelectCallHistory (history: CallHistory) {
      setHarmCaseList(sbHarmCaseList);
      setSearched(true);
      setSearchWord(formatTelnumber(history.phoneNumber));
    },
    onCancelSearch () {
      setSearched(false);
      setSearchWord(undefined);
      setHarmCaseList([]);
    },
    onSearchWordEndEditing (text: string) {
      if (text)
      {
        setHarmCaseList(sbHarmCaseList);
        setSearched(true);
        setSearchWord(text);
      }
    }
  };
  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

const sbHarmCaseList = [
  {
    accountId: 'string', reason: '멍청함', local: '경북', likeCount: 123, unlikeCount: 12, firmName: '성진테크', firmNumber: '02231232312412',
    cliName: '성진건설', telNumber: '0101111111', telNumber2: '0102222222', telNumber3: '0102321332423', searchTime: '3242342354'
  },
  {
    accountId: 'string', reason: '멍청함', local: '경북', likeCount: 123, unlikeCount: 12, firmName: '성진건설', firmNumber: '02231232312412',
    cliName: '성진건설', telNumber: '0101111111', telNumber2: '0102222222', telNumber3: '0102321332423', searchTime: '3242342354'
  },
  {
    accountId: 'string', reason: '멍청함', local: '경북', likeCount: 123, unlikeCount: 12, firmName: '성진건설', firmNumber: '02231232312412',
    cliName: '성진건설', telNumber: '0101111111', telNumber2: '0102222222', telNumber3: '0102321332423', searchTime: '3242342354'
  },
  {
    accountId: 'string', reason: '멍청함', local: '경북', likeCount: 123, unlikeCount: 12, firmName: '성진건설', firmNumber: '02231232312412',
    cliName: '성진건설', telNumber: '0101111111', telNumber2: '0102222222', telNumber3: '0102321332423', searchTime: '3242342354'
  }
];

export default FirmHarmCaseSearchSBProvider;