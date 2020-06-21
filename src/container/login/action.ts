import * as api from 'src/api/api';

import { UserProfile, UserType } from 'src/types';

import { Alert } from 'react-native';
import { Firm } from 'src/provider/LoginProvider';
import { User } from 'firebase';
import { notifyError } from 'src/common/ErrorNotice';

/**
 * 장비 기사인경우 업체정보 설정
 */
export const updateFirmInfo = (user: User, userProfile: UserProfile, setFirm: (firm: Firm) => void): Promise<Firm | null> =>
{
  if (!user.uid || !userProfile || userProfile.userType !== UserType.FIRM)
  {
    console.log('>>> invalid updateFirmInfo: ', userProfile?.userType);
    return Promise.resolve(null);
  }

  return api
    .getFirm(user.uid)
    .then(firm =>
    {
      console.log('Loading Firm Info: ', user.uid, firm);
      if (firm)
      {
        setFirm(firm);

        return firm;
      }
      else
      {
        Alert.alert(
          '등록된 정보가 없습니다!',
          '장비등록을 먼저 해 주세요.',
          [{ text: '확인' }],
          { cancelable: false }
        );

        return null;
      }
    })
    .catch(error =>
    {
      notifyError(
        '업체정보 확인중 문제발생',
        `업체정보를 불러오는 도중 문제가 발생했습니다, 다시 시도해 주세요 -> [${
          error.name
        }] ${error.message}`,
        [
          { text: '취소' },
          { text: '업체정보 요청하기', onPress: (): void => { updateFirmInfo(user, userProfile, setFirm) } }
        ]
      );
      return null;
    });
};
