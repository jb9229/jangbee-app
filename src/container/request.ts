import { Alert, Clipboard } from 'react-native';

import getString from 'src/STRING';

export const noticeUserError = (location: string, title: string, errMsg: string): void =>
{
  Alert.alert(title, getString('USER_ERROR_NOTICE'),
    [
      { text: 'Copy', onPress: (): void => { Clipboard.setString('Location: ' + location + '\n\n ' + errMsg) } },
      { text: 'Ok', onPress: () => {} }
    ]);
};
