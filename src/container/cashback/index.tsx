import * as React from 'react';

import { CashBackCrtDto, CashBackCrtError, ScreenMode } from 'src/container/cashback/type';
import { StyleProp, ViewStyle } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';

import { CASHBACKS } from 'src/api/queries';
import { CASHBACK_CREATE } from 'src/api/mutations';
import CashBackLayout from 'src/container/cashback/CashBackLayout';
import { noticeUserError } from 'src/container/request';
import { useLoginContext } from 'src/contexts/LoginContext';
import { validateCrtDto } from 'src/container/cashback/CashBackAction';

interface Props {
  wrapperStyle?: StyleProp<ViewStyle>;
}
const CashBackContainer: React.FC<Props> = () =>
{
  // stats
  const { user, userProfile, popLoading, saveUserProfileAssets, refetchUserProfile } = useLoginContext();
  const [crtDto, setCrtDto] = React.useState(new CashBackCrtDto(user.uid));
  const [crtError, setCrtError] = React.useState(new CashBackCrtError());
  const [screenMode, setScreenMode] = React.useState(ScreenMode.DEFAULT);

  // Server request data
  const cashbacksRes = useQuery(CASHBACKS, { variables: { accountId: user.uid }, fetchPolicy: 'cache-and-network' });
  const [registerReq, registerRes] = useMutation(CASHBACK_CREATE, {
    onCompleted: (data) =>
    {
      refetchUserProfile();
      setCrtDto(new CashBackCrtDto(user.uid));
      setScreenMode(ScreenMode.LIST);
      if (cashbacksRes.called)
      {
        cashbacksRes.refetch();
      }
      popLoading(false);
    },
    onError: (error) =>
    {
      const updateAssets = {
        ...userProfile.assets,
        balance: userProfile.assets.balance + crtDto.amount
      };
      saveUserProfileAssets(updateAssets)
        .then((res) =>
        {
          refetchUserProfile();
        });
      popLoading(false);
      noticeUserError('CashBackContainer -> registerReq -> error', error);
    }
  });

  return (
    <CashBackLayout
      crtDto={crtDto}
      crtError={crtError}
      screenMode={screenMode}
      assetMoney={userProfile?.assets?.balance || 0}
      cashbacks={cashbacksRes?.data?.cashbacks || []}
      onSubmitRegister={(): void =>
      {
        const validResult = validateCrtDto(crtDto, userProfile?.assets?.balance || 0);
        if (validResult.result)
        {
          popLoading(true, '캐쉬백 신청중...');
          console.log('>>> registerReq~~');
          const updateAssets = {
            ...userProfile.assets,
            balance: userProfile.assets.balance - crtDto.amount
          };
          saveUserProfileAssets(updateAssets)
            .then((res) =>
            {
              console.log('>>> save user profile res: ', res);
              delete crtDto.amountStr;
              console.log('>>> crtDto: ', { ...crtDto, accountNumber: `${crtDto.accountNumber}` });
              registerReq({ variables: { crtDto: { ...crtDto, accountNumber: `${crtDto.accountNumber}` } } });
            });
        }

        setCrtError(validResult.error);
      }}
      setScreenMode={setScreenMode}
    />
  );
};

export default CashBackContainer;
