import * as api from 'src/api/api';

export const searchFirmHarmCase = (searchWord: string): Promise<Array<object>> =>
{
  return api
    .searchClientEvaluList(searchWord);
};
