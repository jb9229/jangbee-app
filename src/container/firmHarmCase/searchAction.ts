import * as api from 'api/api';

import { noticeUserError } from "../request";

const searchFilterCliEvalu = (searchWord: string): void =>
  {
    const pNumber = searchWord.split('-').join('');
    const paramStr = `searchWord=${pNumber}`;

    api
      .searchClientEvaluList(paramStr)
      .then(resBody =>
      {
        if (resBody)
        {
          if (resBody.length === 0)
          {
            notice = `[${searchWord}]는 현재 피해사례에 조회되지 않습니다.`;
          }
          
          
          
          setSearchTime(moment().format('YYYY.MM.DD HH:mm'));
        }
      })
      .catch(ex =>
      {
        noticeUserError('피해사례 요청 문제', `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`);
        throw ex;
      });
  };