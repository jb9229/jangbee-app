import * as api from 'api/api';

import { Alert } from 'react-native';
import { User } from 'firebase';
import { noticeUserError } from 'src/container/request';
import produce from 'immer';

export const applyWork = (workId: string, user: User, openWorkListRequest: any): void =>
{
  const applyData = {
    workId,
    accountId: user.uid
  };

  api
    .applyWork(applyData)
    .then(resBody =>
    {
      if (resBody)
      {
        openWorkListRequest();
      }
    })
    .catch(error => { noticeUserError('FimWorkAction(applywork api call error)', 'Please try again', error.message) });
};

/**
 * 일감 매칭요청 수락하기 함수
 */
export const acceptWorkRequest = (user: User, couponSelected: boolean): void =>
{
  const { acceptWorkId } = this.state;

  const acceptData = {
    workId: acceptWorkId,
    accountId: user.uid,
    coupon: couponSelected
  };

  api
    .acceptWork(acceptData)
    .then(resBody =>
    {
      if (resBody)
      {
        this.setOpenWorkListData();
        this.setMatchedWorkListData();
        this.setState({ isVisibleAccSelModal: false });
        return;
      }

      Alert.alert(
        '배차하기 문제',
        '배차되지 않았습니다, 통장잔고 및 통장 1년인증 상태, 배차요청 3시간이 지났는지 리스트 리프레쉬 후 확인해 주세요'
      );

      this.setOpenWorkListData();
    })
    .catch((error) => { noticeUserError('FimWorkAction(acceptWork api call error)', 'Please try again', error.message) });
};

/**
 * 매칭된일감 포기 요청함수
 */
export const abandonWork = (user: User, workId: string, openWorkListRequest: any): void =>
{
  const abandonData = {
    workId,
    matchedAccId: user.uid
  };

  api
    .abandonWork(abandonData)
    .then(result =>
    {
      if (result)
      {
        openWorkListRequest();
      }
    })
    .catch((error) => { noticeUserError('FimWorkAction(abandonWork api call error)', 'Please try again', error.message) });
};

export enum ActionType {}

const reducer: Reducer = (state = initialState, action) =>
{
  return produce(state, (draft) =>
  {
    const { type, payload } = action;
    switch (type)
    {
      case ActionType.AddFriend: {
        if (!draft.friends.find((friend) => friend.id === payload.user.id))
        {
          const index = draft.friends.findIndex(
            (friend) =>
              (payload.user?.nickname || '').toLowerCase() <
              (friend?.nickname || '').toLowerCase()
          );
          draft.friends.splice(
            index === -1 ? draft.friends.length : index,
            0,
            payload.user
          );
        }
        break;
      }
    }
  });
};
