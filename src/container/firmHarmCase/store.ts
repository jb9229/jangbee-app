import Recoil, { atom, selector } from 'recoil';

import { FIRMHARMCASE_COUNT } from 'src/api/queries';
import { FirmHarmCaseCountData } from './type';
import { apolloClient } from 'src/api/apollo';

// export const firmHarmCaseCountState = atom<FirmHarmCaseCountData>({
//   key: 'firmHarmCaseCountState', // unique ID (with respect to other atoms/selectors)
//   default: { myCnt: -1, totalCnt: -1 } // default value (aka initial value)
// });

export const firmHarmCaseCountUserId = atom<FirmHarmCaseCountData>({
  key: 'firmHarmCaseCountUserId', // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const alarmSettingModalStat = atom<{
  visible: boolean;
  newVersion?: string;
}>({
  key: 'alarmSettingModalStat', // unique ID (with respect to other atoms/selectors)
  default: { visible: false, newVersion: '' }, // default value (aka initial value)
});

export const fetchData = async () => {
  const response = await apolloClient.query({
    query: FIRMHARMCASE_COUNT,
    variables: { id: undefined },
    fetchPolicy: 'network-only',
  });

  return response.data?.firmHarmCaseCount || { myCnt: -1, totalCnt: -1 };
};

export const firmHarmCaseCountState = atom<FirmHarmCaseCountData>({
  key: 'firmHarmCaseCountState',
  default: fetchData(), // default value (aka initial value)
  // get: async({ get }) =>
  // {
  //   const userId = get(firmHarmCaseCountUserId);

  //   const response = await apolloClient.query({
  //     query: FIRMHARMCASE_COUNT,
  //     variables: { id: userId },
  //     fetchPolicy: 'network-only'
  //   });

  //   return response.data?.firmHarmCaseCount || { myCnt: -1, totalCnt: -1 };
  // },
  // set: async({ set }, value) =>
  // {
  //   const response = await apolloClient.query({
  //     query: FIRMHARMCASE_COUNT,
  //     variables: { id: undefined },
  //     fetchPolicy: 'network-only'
  //   });

  //   set(firmHarmCaseCountState, response.data?.firmHarmCaseCount || { myCnt: -1, totalCnt: -1 });
  // }
});
