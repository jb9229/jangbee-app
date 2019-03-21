import CmException from '../common/CmException';
import JBServerException from '../common/JBServerException';
import * as obconfig from '../openbank-config';

/**
 * HttpRequest Json 응답처리
 *
 * @param {Object} res HttpResponse
 */
export function handleJsonResponse(res) {
  if (res.ok) {
    if (res.status === 204) {
      // NO_CONTENTS
      return null;
    }

    return res.json();
  }

  throw new CmException(res.status, `${res.url}`);
}

/**
 * HttpRequest Json 응답처리
 *
 * @param {Object} res HttpResponse
 */
export function handleJBServerJsonResponse(res) {
  if (res.ok) {
    if (res.status === 204) {
      // NO_CONTENTS
      return null;
    }

    return res.json();
  }

  throw res;
}

/**
 * HttpRequest Json 200/400 응답처리
 *
 * @param {Object} res HttpResponse
 */
export function handleBadReqJsonResponse(res) {
  if (res.ok || res.status === 400) {
    if (res.status === 204) {
      // NO_CONTENTS
      return res;
    }

    return res.json().then(responseJson => responseJson);
  }

  throw new CmException(res.status, `${res.url}`);
}

/**
 * HttpRequest Text 응답처리
 *
 * @param {Object} res HttpResponse
 */
export function handleTextResponse(res) {
  if (res.ok) {
    if (res.status === 204) {
      // NO_CONTENTS
      return res;
    }

    return res.text().then(responseText => responseText);
  }

  throw new CmException(res.status, `${res.url}`);
}

/**
 * HttpRequest 204 응답처리
 *
 */
export function handleNoContentResponse(res) {
  if (res.status === 204) {
    return true;
  }

  throw new CmException(res.status, `${res.url}`);
}

/** ***************** Open bank API Handle ******************************** */

/**
 * 오픈뱅크 JSON 응답처리 함수
 * @param {Object} res : Json 응답결과
 */
export function handleOpenBankJsonResponse(res) {
  if (res.ok) {
    if (res.status === 204) {
      // NO_CONTENTS
      return res;
    }

    return res.json().then((responseJson) => {
      const rspCode = responseJson.rsp_code;

      if (rspCode === obconfig.API_RESPONSECODE_OK) {
        return responseJson;
      }

      throw new CmException(rspCode, `[${responseJson.rsp_message}] ${res.url}`);
    });
  }

  throw new CmException(res.status, `${res.url}`);
}
