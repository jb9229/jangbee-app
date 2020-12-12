import { BackHandler, ToastAndroid } from 'react-native';

export const onPressBackbutton = (): boolean =>
{
  const { backButtonCondition } = this.state;

  if (backButtonCondition.isDoubleClick)
  {
    BackHandler.exitApp();
  }
  else
  {
    ToastAndroid.show('한번 더 누르시면 앱이 종료됩니다!', ToastAndroid.SHORT);

    backButtonCondition.isDoubleClick = true;

    setTimeout(() =>
    {
      backButtonCondition.isDoubleClick = false;
    }, 3000);

    return true;
  }

  return true;
};
