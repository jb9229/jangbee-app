import { UserProfile, UserType } from 'src/types';
import { execute, makePromise } from 'apollo-link';

import { Alert } from 'react-native';
import { FIRM } from 'src/api/queries';
import { Firm } from 'src/provider/LoginProvider';
import { GraphQLRequest } from '@apollo/client';
import { User } from 'firebase';
import { apolloClient } from 'src/api/apollo';
import { notifyError } from 'src/common/ErrorNotice';

/**
 * 장비 기사인경우 업체정보 설정
 */
export const updateFirmInfo = async(user: User, userProfile: UserProfile, setFirm: (firm: Firm) => void): Promise<Firm | null> =>
{
  if (!user.uid || !userProfile || userProfile.userType !== UserType.FIRM)
  {
    console.log('>>> invalid updateFirmInfo: ', userProfile?.userType);
    return Promise.resolve(null);
  }

  const operation: GraphQLRequest = {
    query: FIRM,
    variables:
    {
      accountId: user.uid
    }
  };

  return await makePromise(execute(apolloClient.link, operation)).then(
    result =>
    {
      console.log('>>> firm result: ', result)
      if (result?.data?.firm === undefined)
      {
        Alert.alert(
          '등록된 정보가 없습니다!',
          '장비등록을 먼저 해 주세요.',
          [{ text: '확인' }],
          { cancelable: false }
        );

        return null;
      }

      const firm = result?.data?.firm;

      setFirm(firm);

      return firm;
    }
  ).catch(error =>
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
