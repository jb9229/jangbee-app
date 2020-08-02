import * as React from 'react';

import { CallHistory, CallHistoryType } from './type';

import CallLogs from 'react-native-call-log';
import { DefaultNavigationProps } from 'src/types';
import { PermissionsAndroid } from 'react-native';
import { Provider } from 'src/contexts/FirmHarmCaseSearchContext';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseSearchProvider = (props: Props): React.ReactElement =>
{
  const [callHistory, setCallHistory] = React.useState<Array<CallHistory>>([]);

  React.useEffect(() => {
    (async () => {
      try {
        console.log('>>> 1')
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
        )
        console.log('>>> 2: ', granted)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('>>> 3')
          CallLogs.load(500, {}).then(c => { console.log(c); setCallHistory(c) });
        } else {
          console.log('Call Log permission denied');
        }
      }
      catch (e) {
        console.log('>>> -1')
        console.log(e);
      }
    })()
  }, []);

  // Server api call
  // Init Actions
  // Init States
  const states = {
    callHistory: callHistory.filter((history) => history.rawType !== CallHistoryType.OUTGOING),
    harmCaseList: []
  };
  const actions = {
  };
  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};
export default FirmHarmCaseSearchProvider;