import CmException from "../common/CmException";

/**
 * HttpRequest Json Common 응답 처리
 *
 * @param {Object} res HttpResponse
 */
export function handleJsonResponse(res) {
  if (res.ok) {
    if (res.status === 204) {
      // NO_CONTENTS
      return res;
    }

    return res.json().then(responseJson => {
      return responseJson;
    });
  }

  throw new CmException(res.status, `${res.statusText}, ${res.url}`);
}
