import * as api from 'src/api/api';

import { User } from 'src/types';
import { noticeUserError } from 'src/container/request';

export const applyWork = (
  workId: string,
  user: User,
  openWorkListRequest: any
): void => {
  const applyData = {
    workId,
    accountId: user.uid,
  };

  api
    .applyWork(applyData)
    .then(resBody => {
      if (resBody) {
        openWorkListRequest();
      }
    })
    .catch(error => {
      noticeUserError(
        'FimWorkAction(applywork api call error)',
        error.message,
        user
      );
    });
};

/**
 * 일감 매칭요청 수락하기 함수
 */
export const acceptWorkRequest = (
  acceptWorkId: string,
  user: User,
  couponSelected: boolean,
  sid?: string
): Promise<any> => {
  const acceptData = {
    workId: acceptWorkId,
    accountId: user.uid,
    coupon: couponSelected,
    sid: sid,
  };

  return api.acceptWork(acceptData);
};

/**
 * 매칭된일감 포기 요청함수
 */
export const abandonWork = (
  user: User,
  workId: string,
  openWorkListRequest: any
): void => {
  const abandonData = {
    workId,
    matchedAccId: user.uid,
  };

  api
    .abandonWork(abandonData)
    .then(result => {
      if (result) {
        openWorkListRequest();
      }
    })
    .catch(error => {
      noticeUserError(
        'FimWorkAction(abandonWork api call error)',
        error.message,
        user
      );
    });
};

/**
 * 차주일감 지원
 */
export const applyFirmWork = (
  userId: string,
  work: any,
  sid: string,
  coupon: boolean
): Promise<boolean> => {
  const applyData = {
    workId: work.id,
    accountId: userId,
    sid: sid,
    coupon: coupon,
  };

  return api.applyFirmWork(applyData);
};

export enum ActionType {}
