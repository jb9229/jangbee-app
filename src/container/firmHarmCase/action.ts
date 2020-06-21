import * as api from 'src/api/api';

import { notifyError } from 'common/ErrorNotice';

export const getClientEvaluCount = (accountId: string, setCountData: (n: string) => void) =>
{
  api
    .getClientEvaluCount(accountId)
    .then(countData =>
    {
      if (countData)
      {
        setCountData(countData);
      }
    })
    .catch(ex =>
    {
      notifyError(
        '피해사례 통계 요청',
        `피해사례 통계 요처에 문제가 있습니다, 다시 시도해 주세요${ex.message}`
      );
    });
};
