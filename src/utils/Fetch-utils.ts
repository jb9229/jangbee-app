import CmException from 'common/CmException';

/**
 * HttpRequest Json 응답처리
 *
 * @param {Object} res HttpResponse
 */
export async function handleJBServerJsonResponse (res): Promise<any>
{
  if (res.ok)
  {
    if (res.status === 204)
    {
      // NO_CONTENTS
      return true;
    }

    return res.json();
  }

  const badRes = res.text();

  if (badRes)
  {
    const eMsg = await badRes.then(errorText => errorText);
    const eMsgJson = JSON.parse(eMsg);
    throw eMsgJson;
  }

  throw new CmException(
    '예상치 못한 예외입니다',
    `관리자에게 문의 부탁 드립니다(${res})`
  );
}

/**
 * HttpRequest Text 응답처리
 *
 * @param {Object} res HttpResponse
 */
export function handleTextResponse (res)
{
  if (res.ok)
  {
    if (res.status === 204)
    {
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
export function handleNoContentResponse (res)
{
  if (res.status === 204)
  {
    return true;
  }

  throw new CmException(res.status, `${res.url}`);
}
