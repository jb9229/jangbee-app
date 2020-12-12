import { Alert } from 'react-native';

export function notifyError (eName, eMessage, refreshFunc): void
{
  if (eMessage && eMessage.endsWith('Network request failed'))
  {
    if (refreshFunc)
    {
      return Alert.alert(
        '통신 상태가 좋지 않습니다.',
        eMessage,
        [{ text: '재시도', onPress: (): void => refreshFunc() }],
        { cancelable: false }
      );
    }

    return Alert.alert('통신 상태가 좋지 않습니다.', eMessage);
  }
  return Alert.alert(eName, eMessage);
}
