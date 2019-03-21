import * as url from '../constants/Url';
import {
  handleJsonResponse,
  handleJBServerJsonResponse,
  handleTextResponse,
  handleNoContentResponse,
  handleBadReqJsonResponse,
  handleOpenBankJsonResponse,
} from '../utils/Fetch-utils';
import * as kakaoconfig from '../kakao-config';
import * as obconfig from '../openbank-config';
import CmException from '../common/CmException';

export function getEquipList() {
  return fetch(url.JBSERVER_EQUILIST).then(handleJsonResponse);
}

export function createFirm(newFirm) {
  return fetch(url.JBSERVER_FIRM, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newFirm),
  }).then(handleJsonResponse);
}

export function getFirm(accountId) {
  const param = encodeURIComponent(accountId);
  return fetch(`${url.JBSERVER_FIRM}/${param}`);
}

/**
 * 주변 장비업체 검색요청 함수
 */
export function getNearFirmList(page, equipment, sLongitude, sLatitude) {
  const paramData = {
    equipment,
    longitude: sLongitude,
    latitude: sLatitude,
    page,
    size: 2,
  };

  return fetch(
    `${url.JBSERVER_FIRMNEAR}?equipment=${encodeURIComponent(
      paramData.equipment,
    )}&longitude=${encodeURIComponent(paramData.longitude)}&latitude=${encodeURIComponent(
      paramData.latitude,
    )}&page=${encodeURIComponent(paramData.page)}&size=${encodeURIComponent(paramData.size)}`,
  ).then(handleJsonResponse);
}

/**
 * 지역 장비업체 검색요청 함수
 */
export function getLocalFirmList(page, equipment, searSido, searGungo) {
  const paramData = {
    equipment,
    sido: searSido,
    gungu: searGungo,
    page,
    size: 2,
  };

  return fetch(
    `${url.JBSERVER_FIRMLOCAL}?equipment=${encodeURIComponent(
      paramData.equipment,
    )}&sido=${encodeURIComponent(paramData.sido)}&gungu=${encodeURIComponent(
      paramData.gungu,
    )}&page=${encodeURIComponent(paramData.page)}&size=${encodeURIComponent(paramData.size)}`,
  ).then(handleJsonResponse);
}

export function updateFirm(newFirmData) {
  return fetch(url.JBSERVER_FIRM, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newFirmData),
  }).then(handleJsonResponse);
}

/**
 * 업체가 존재하는 지역정보 조회
 */
export function getFirmLocalData(equipment) {
  const param = encodeURIComponent(equipment);
  return fetch(`${url.JBSERVER_FIRMLOCAL}/${param}`).then(handleJsonResponse);
}

export function uploadImage(uri) {
  const uriParts = uri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  const nowTime = new Date().getTime();

  const formData = new FormData();

  formData.append('img', {
    uri,
    name: `jangbee_photo_+${nowTime}.${fileType}`,
    type: `image/${fileType}`,
  });

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(url.IMAGE_STORAGE, options).then(handleTextResponse);
}

export function removeImage(imgUrl) {
  const index = imgUrl.lastIndexOf('/');
  let fileName = imgUrl.substr(index + 1);

  fileName = decodeURIComponent(fileName);

  const formData = new FormData();

  formData.append('imgName', fileName);
  const options = {
    method: 'POST',
    body: formData,
    headers: {},
  };

  return fetch(`${url.IMAGE_STORAGE}/remove`, options).then(handleNoContentResponse);
}

export function getAddrByGpspoint(longitude, latitude) {
  const paramData = {
    longitude,
    latitude,
  };

  return fetch(
    `${url.KAKAO_GEO_API}?x=${encodeURIComponent(paramData.longitude)}&y=${encodeURIComponent(
      paramData.latitude,
    )}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `KakaoAK ${kakaoconfig.API_KEY}`,
      },
    },
  ).then(handleBadReqJsonResponse);
}

/** ******************** Jangbee Sever Ad  Api List ************************** */

export function createAd(newAd) {
  return fetch(url.JBSERVER_AD, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(newAd),
  }).then(handleJBServerJsonResponse);
}

/**
 * 광고 조회
 */
export function getAd(location, equiTarget, sidoTarget, gugunTarget) {
  let paramUrl = `?adLocation=${location}`;

  if (equiTarget === undefined) {
    paramUrl += '&equiTarget=';
  } else {
    paramUrl += `&equiTarget=${encodeURIComponent(equiTarget)}`;
  }

  if (sidoTarget === undefined) {
    paramUrl += '&sidoTarget=';
  } else {
    paramUrl += `&sidoTarget=${encodeURIComponent(sidoTarget)}`;
  }

  if (gugunTarget === undefined) {
    paramUrl += '&gugunTarget=';
  } else {
    paramUrl += `&gugunTarget=${encodeURIComponent(gugunTarget)}`;
  }

  return fetch(`${url.JBSERVER_AD}${paramUrl}`).then(handleJsonResponse);
}

/**
 * 내광고 조회
 */
export function getJBAdList(accountId) {
  const paramAccountId = encodeURIComponent(accountId);

  const paramUrl = `?accountId=${paramAccountId}`;

  return fetch(`${url.JBSERVER_ADLIST}${paramUrl}`).then(handleJsonResponse);
}

export function getBookedAdType() {
  return fetch(`${url.JBSERVER_ADBOOKED}`).then(handleJsonResponse);
}

/**
 * 장비 타켓광고 중복확인 함수
 *
 * @param {string} equipment 타켓광고의 장비
 */
export function existEuipTarketAd(equipment) {
  const paramEquipment = encodeURIComponent(equipment);
  return fetch(`${url.JBSERVER_ADTARGET_EQUIPMENT}?equipment=${paramEquipment}`).then(
    handleJsonResponse,
  );
}

/**
 * 지역 타켓광고 중복확인 함수
 *
 * @param {string} equipment 타켓광고의 장비
 */
export function existLocalTarketAd(equipment, sido, gungu) {
  const paramEquipment = encodeURIComponent(equipment);
  const paramSido = encodeURIComponent(sido);
  const paramGungu = encodeURIComponent(gungu);
  return fetch(
    `${
      url.JBSERVER_ADTARGET_LOCAL
    }?equipment=${paramEquipment}&sido=${paramSido}&gungu=${paramGungu}`,
  ).then(handleJsonResponse);
}

/** ******************** Open Bank Api List ************************** */

/**
 * 토큰작성 함수
 * @param {Object} openBankAuthInfo 토큰정보
 */
function getAccessToken(accessToken) {
  const headerAuth = `Bearer ${accessToken}`;

  return headerAuth;
}

/**
 * 등록된 계좌목록 조회 함수
 * @param {Object} accessTokenInfo 접근 토큰
 * @param {string} userSeqNo 사용자일련번호
 * @param {string} isInclCancAccount 해지계좌포함여부 (Y:해지계좌포함, N:해지계좌불포함)
 * @param {string} sort 정렬순서 (D:Descending, A:Ascending)
 */
export function getOBAccList(accessTokenInfo, userSeqNo, isInclCancAccount, sort) {
  return fetch(
    `${url.OPENBANK_ACCOUNTLIST}?user_seq_no=${encodeURIComponent(
      userSeqNo,
    )}&include_cancel_yn=${encodeURIComponent(isInclCancAccount)}&sort_order=${encodeURIComponent(
      sort,
    )}`,
    {
      headers: {
        Authorization: getAccessToken(accessTokenInfo),
      },
    },
  ).then(handleOpenBankJsonResponse);
}

/**
 * 오픈뱅크 토큰재인증 함수
 *
 * @param {*} refreshToken refresh 토큰
 */
export function refreshOpenBankAuthToken(refreshToken) {
  const paramData = {
    client_id: obconfig.client_id,
    client_secret: obconfig.secret,
    refresh_token: refreshToken,
    scope: 'login inquiry transfer',
    grant_type: 'refresh_token',
  };

  return fetch(
    `${url.OPENBANK_TOKEN}?
    client_id=${encodeURIComponent(paramData.client_id)}
    &client_secret=${encodeURIComponent(paramData.client_secret)}
    &refresh_token=${encodeURIComponent(paramData.refresh_token)}
    &scope=${encodeURIComponent(paramData.scope)}
    &grant_type=${encodeURIComponent(paramData.grant_type)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    },
  ).then(handleOpenBankJsonResponse);
}
