import * as kakaoconfig from '../../kakao-config';

import {
  handleJBServerJsonResponse,
  handleNoContentResponse,
  handleTextResponse
} from 'utils/Fetch-utils';

import { noticeUserError } from 'src/container/request';
/* eslint-disable @typescript-eslint/camelcase */
import url from 'src/constants/Url';

/** ******************** Jangbee Sever Firm  Api List ************************** */
export function getEquipList ()
{
  return fetch(url.JBSERVER_EQUILIST).then(handleJBServerJsonResponse);
}

/**
 * 주변 장비업체 검색요청 함수
 */
export function getNearFirmList (page, equipment, sLongitude, sLatitude)
{
  const paramData = {
    equipment,
    longitude: sLongitude,
    latitude: sLatitude,
    page,
    size: 10
  };

  return fetch(
    `${url.JBSERVER_FIRMNEAR}?equipment=${encodeURIComponent(
      paramData.equipment
    )}&longitude=${encodeURIComponent(
      paramData.longitude
    )}&latitude=${encodeURIComponent(
      paramData.latitude
    )}&page=${encodeURIComponent(paramData.page)}&size=${encodeURIComponent(
      paramData.size
    )}`
  ).then(handleJBServerJsonResponse);
}

/**
 * 지역 장비업체 검색요청 함수
 */
export function getLocalFirmList (page, equipment, searSido, searSigungu)
{
  const paramData = {
    equipment,
    sido: searSido,
    gungu: searSigungu,
    page,
    size: 10
  };

  let sigunguQuery;

  if (searSigungu)
  {
    sigunguQuery = `&gungu=${encodeURIComponent(paramData.gungu)}`;
  }
  else
  {
    sigunguQuery = '';
  }

  return fetch(
    `${url.JBSERVER_FIRMLOCAL}?equipment=${encodeURIComponent(
      paramData.equipment
    )}&sido=${encodeURIComponent(
      paramData.sido
    )}${sigunguQuery}&page=${encodeURIComponent(
      paramData.page
    )}&size=${encodeURIComponent(paramData.size)}`
  ).then(handleJBServerJsonResponse);
}

export function updateFirm (newFirmData)
{
  return fetch(url.JBSERVER_FIRM, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newFirmData)
  }).then(handleJBServerJsonResponse);
}

/**
 * 업체가 존재하는 지역정보 조회
 */
export function getFirmLocalData (equipment)
{
  const param = encodeURIComponent(equipment);
  return fetch(`${url.JBSERVER_FIRMLOCAL}/${param}`).then(handleJBServerJsonResponse);
}


export function getAddrByGpspoint (longitude, latitude)
{
  const paramData = {
    longitude,
    latitude
  };

  return fetch(
    `${url.KAKAO_GEO_API}?x=${encodeURIComponent(
      paramData.longitude
    )}&y=${encodeURIComponent(paramData.latitude)}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `KakaoAK ${kakaoconfig.API_KEY}`
      }
    }
  ).then(handleJBServerJsonResponse);
}

/** ******************** Jangbee Sever Ad  Api List ************************** */

export function createAd (newAd)
{
  return fetch(url.JBSERVER_AD, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(newAd)
  }).then(handleJBServerJsonResponse);
}

/**
 * 광고 조회
 */
export function getAd (location, equiTarget, sidoTarget, gugunTarget)
{
  let paramUrl = `?adLocation=${location}`;

  if (equiTarget === undefined)
  {
    paramUrl += '&equiTarget=';
  }
  else
  {
    paramUrl += `&equiTarget=${encodeURIComponent(equiTarget)}`;
  }

  if (sidoTarget === undefined)
  {
    paramUrl += '&sidoTarget=';
  }
  else
  {
    paramUrl += `&sidoTarget=${encodeURIComponent(sidoTarget)}`;
  }

  if (gugunTarget === undefined)
  {
    paramUrl += '&gugunTarget=';
  }
  else
  {
    paramUrl += `&gugunTarget=${encodeURIComponent(gugunTarget)}`;
  }

  return fetch(`${url.JBSERVER_AD}${paramUrl}`).then(handleJBServerJsonResponse);
}

/**
 * 내광고 조회
 */
export function getJBAdList (accountId)
{
  const paramAccountId = encodeURIComponent(accountId);

  const paramUrl = `?accountId=${paramAccountId}`;

  return fetch(`${url.JBSERVER_ADLIST}${paramUrl}`).then(handleJBServerJsonResponse);
}

export function getBookedAdType ()
{
  return fetch(`${url.JBSERVER_ADBOOKED}`).then(handleJBServerJsonResponse);
}

/**
 * 장비 타켓광고 중복확인 함수
 *
 * @param {string} equipment 타켓광고의 장비
 */
export function existEuipTarketAd (equipment)
{
  const paramEquipment = encodeURIComponent(equipment);
  return fetch(
    `${url.JBSERVER_ADTARGET_EQUIPMENT}?equipment=${paramEquipment}`
  ).then(handleJBServerJsonResponse);
}

/**
 * 지역 타켓광고 중복확인 함수
 *
 * @param {string} equipment 타켓광고의 장비
 */
export function existLocalTarketAd (equipment, sido, gungu)
{
  const paramEquipment = encodeURIComponent(equipment);
  const paramSido = encodeURIComponent(sido);
  const paramGungu = encodeURIComponent(gungu);
  return fetch(
    `${
      url.JBSERVER_ADTARGET_LOCAL
    }?equipment=${paramEquipment}&sido=${paramSido}&gungu=${paramGungu}`
  ).then(handleJBServerJsonResponse);
}

/**
 * 광고 업데이트
 * @param {Object} newAd 업데이트할 광고
 */
export function updateAd (newAd)
{
  return fetch(url.JBSERVER_AD, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(newAd)
  }).then(handleJBServerJsonResponse);
}

export function updateFinUseNumAd (selFinUseNum, accountId)
{
  return fetch(url.JBSERVER_AD_UPDATE_FINTECHUSENUM, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({ newFintechUseNum: selFinUseNum, accountId })
  }).then(handleJBServerJsonResponse);
}

/**
 * 광고종료 API 함수
 * @param {long} id 종료한 광고 아이디
 */
export function terminateAd (id)
{
  return fetch(`${url.JBSERVER_AD}?id=${id}`, {
    method: 'DELETE',
    headers: {}
  }).then(handleJBServerJsonResponse);
}

/**
 *
 * @param {*} price AD Price
 */
export function requestPaymentReady (itemName: string, uid: string, orderId: string, price: number): Promise<any>
{
  const newReady = {
    partnerUserId: uid,
    partnerOrderId: orderId,
    itemName: itemName,
    totalAmount: price
  };

  return fetch(`${url.JBSERVER_PAYMENT_READY}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newReady)
    }
  ).then(handleJBServerJsonResponse);
}

/**
 *
 * @param {*} price AD Price
 */
export function requestWorkPaymentApproval (params): Promise<any>
{
  return fetch(`${url.JBSERVER_PAYMENT_APPROVAL}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }
  ).then(handleJBServerJsonResponse);
}

/** ******************** Client Evaluation Api List ************************** */

/**
 * 블랙리스트 추가 API 요청 함수
 *
 * @param {object} newEvaluation 신규 블랙리스트
 */
export function createClientEvaluation (newEvaluation)
{
  return fetch(url.JBSERVER_CLIENT_EVALU, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(newEvaluation)
  }).then(handleJBServerJsonResponse);
}

export function getClientEvaluList (page, accountId, mine)
{
  const param = encodeURIComponent(accountId);
  return fetch(
    `${
      url.JBSERVER_CLIENT_EVALU_ALL
    }?page=${page}&size=${10}&accountId=${param}&mine=${mine}`
  ).then(handleJBServerJsonResponse);
}

export function searchClientEvaluList (paramStr)
{
  return fetch(`${url.JBSERVER_CLIENT_EVALU}?searchWord=${paramStr}`).then(
    handleJBServerJsonResponse
  );
}

export function existClinetEvaluTelnumber (telNumber)
{
  return fetch(
    `${url.JBSERVER_CLIENT_EVALU_TELEXIST}?telNumber=${telNumber}`
  ).then(handleJBServerJsonResponse);
}

/**
 * 블랙리스트 내용 업데이트
 *
 * @param {object} updateEvaluation 업데이트할 블랙리스트 내용(cliName, reason)
 */
export function updateClientEvaluation (updateEvaluation)
{
  return fetch(url.JBSERVER_CLIENT_EVALU, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(updateEvaluation)
  }).then(handleJBServerJsonResponse);
}

/**
 * 공감/비공감 추가 API 요청 함수
 * @param {object} newEvaluLike 신규 공감
 */
export function createClientEvaluLike (newEvaluLike)
{
  return fetch(url.JBSERVER_CLIENT_EVALULIKE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(newEvaluLike)
  }).then(handleJBServerJsonResponse);
}

export function getClientEvaluLikeList (id)
{
  return fetch(`${url.JBSERVER_CLIENT_EVALULIKE}?evaluId=${id}`).then(
    handleJBServerJsonResponse
  );
}

export function existEvaluLike (accountId, evaluId)
{
  return fetch(
    `${
      url.JBSERVER_CLIENT_EVALULIKE_EXIST
    }?accountId=${accountId}&evaluId=${evaluId}`
  ).then(handleJBServerJsonResponse);
}

export function deleteCliEvaluLike (evaluId, accountId, like)
{
  const param = encodeURIComponent(accountId);
  return fetch(
    `${
      url.JBSERVER_CLIENT_EVALULIKE
    }?evaluId=${evaluId}&accountId=${param}&like=${like}`,
    {
      method: 'DELETE',
      headers: {}
    }
  ).then(handleJBServerJsonResponse);
}

/** ******************** Firm Evaluation Api List ************************** */

export function createFirmEvalu (evaluData)
{
  return fetch(url.JBSERVER_FIRM_EVALU, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(evaluData)
  }).then(handleJBServerJsonResponse);
}

export function getFirmEvalu (accountId)
{
  return fetch(`${url.JBSERVER_FIRM_EVALU}?accountId=${accountId}`).then(
    handleJBServerJsonResponse
  );
}

/** ******************** Work Api List ************************** */

export function createWork (newWork)
{
  return fetch(url.JBSERVER_WORK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(newWork)
  }).then(handleJBServerJsonResponse);
}

export function updateWork (work)
{
  return fetch(url.JBSERVER_WORK, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(work)
  }).then(handleJBServerJsonResponse);
}

export function getFirmOpenWorkList (equipment, accountId)
{
  const param1 = encodeURIComponent(equipment);
  const param2 = encodeURIComponent(accountId);
  return fetch(
    `${url.JBSERVER_WORK_FIRM_OPEN}?equipment=${param1}&accountId=${param2}`
  ).then(handleJBServerJsonResponse);
}

export function getClientOpenWorkList (accountId)
{
  const param = encodeURIComponent(accountId);
  return fetch(`${url.JBSERVER_WORK_CLIENT_OPEN}?accountId=${param}`).then(
    handleJBServerJsonResponse
  );
}

export function getFirmMatchedWorkList (equipment, accountId)
{
  const param1 = encodeURIComponent(equipment);
  const param2 = encodeURIComponent(accountId);
  return fetch(
    `${url.JBSERVER_WORK_FIRM_MATCHED}?equipment=${param1}&accountId=${param2}`
  ).then(handleJBServerJsonResponse);
}

export function getClientMatchedWorkList (accountId)
{
  const param = encodeURIComponent(accountId);
  return fetch(`${url.JBSERVER_WORK_CLIENT_MATCHED}?accountId=${param}`).then(
    handleJBServerJsonResponse
  );
}

export function getAppliFirmList (workId)
{
  return fetch(`${url.JBSERVER_WORK_APPLICANTS}?workId=${workId}`).then(
    handleJBServerJsonResponse
  );
}

export function applyWork (applyData)
{
  return fetch(url.JBSERVER_WORK_FIRM_APPLY, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(applyData)
  }).then(handleJBServerJsonResponse);
}

export function applyFirmWork (applyData)
{
  return fetch(url.JBSERVER_FIRMWORK_FIRM_APPLY, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(applyData)
  }).then(handleJBServerJsonResponse);
}

export function selectAppliFirm (selectData)
{
  return fetch(url.JBSERVER_WORK_CLIENT_SELECT, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(selectData)
  }).then(handleJBServerJsonResponse);
}

export function acceptWork (acceptData)
{
  return fetch(url.JBSERVER_WORK_FIRM_ACCEPT, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(acceptData)
  }).then(handleJBServerJsonResponse);
}

export function abandonWork (abandonData)
{
  return fetch(url.JBSERVER_WORK_FIRM_ABANDON, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(abandonData)
  }).then(handleJBServerJsonResponse);
}

export function cancelSelFirm (workId)
{
  const formData = new FormData();
  formData.append('workId', workId);

  return fetch(url.JBSERVER_WORK_CLIENT_CANCELSEL, {
    method: 'PUT',
    body: formData
  }).then(handleJBServerJsonResponse);
}

/** ******************** Coupon Api List ************************** */
export function getCoupon (accountId)
{
  return fetch(`${url.JBSERVER_COUPON}?accountId=${accountId}`).then(
    handleJBServerJsonResponse
  );
}

export function getAvailCashback (accountId)
{
  return fetch(`${url.JBSERVER_CASHBACK}?accountId=${accountId}`).then(
    handleJBServerJsonResponse
  );
}

export function requestCashback (depositData)
{
  return fetch(url.JBSERVER_CASHBACK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(depositData)
  }).then(handleJBServerJsonResponse);
}

export function getFirmCountChart (equipment)
{
  return fetch(`${url.JBSERVER_STAT}?equipment=${equipment}`).then(
    handleJBServerJsonResponse
  );
}