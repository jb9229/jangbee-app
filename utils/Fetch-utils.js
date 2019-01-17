import CmException from '../common/CmException';

/**
 * HttpRequest Json 응답처리
 *
 * @param {Object} res HttpResponse
 */
export function handleJsonResponse(res) {
  if (res.ok) {
    if (res.status === 204) {
      // NO_CONTENTS
      return res;
    }

    return res.json().then(responseJson => responseJson);
  }

  throw new CmException(res.status, `${res.statusText}, ${res.url}`);
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

  throw new CmException(res.status, `${res.statusText}, ${res.url}`);
}
