import * as api from 'api/api';

import { CallHistory, CallHistoryType } from "./type";

import { Share } from "react-native";
import { formatNumber } from "src/utils/NumberUtils";
import { formatTelnumber } from "src/utils/StringUtils";

export const deleteFirmHarmCase = (id: string): Promise<object> => {
  return api
    .deleteCliEvalu(id)
}

export const filterCallHistory = (callHistory: Array<CallHistory>):Array<CallHistory> | undefined => {
  if (!callHistory) { return undefined }
  const callNumberArr = [];
  const filterdHistory = callHistory.filter((history) => {
    if (callNumberArr.includes(history.phoneNumber)) { return false }
    callNumberArr.push(history.phoneNumber);

    return history.rawType !== CallHistoryType.OUTGOING;
  });

  return filterdHistory;
};

export const shareNotExistCEvalu = (filterStr, filterTime) => {
  let searWord = filterStr;

  try {
    Share.share({
      message: `[${searWord}] 피해사례 조회\n\n조회: ${searWord}\n결과: 현재 피해사례가 없습니다\n조회 시간: ${filterTime}\n\n자세한 내용은 무료가입 악덕공유 [장비 콜] 앱에서 확인해 주세요.\nhttps://play.google.com/store/apps/details?id=com.kan.jangbeecall`
    });
  } catch (error) {
    console.error(error);
  }
}

export const shareClientEvalu = (evalu, searchTime) => {
  try {
    Share.share({
      message: `[${formatTelnumber(
        evalu.telNumber
      )}] 피해사례\n\n${makeShareContent(
        '이름',
        evalu.cliName
      )}${makeShareContent('업체명', evalu.firmName)}${makeShareContent(
        '전화번호2',
        evalu.telNumber2
      )}${makeShareContent('전화번호3', evalu.telNumber3)}${makeShareContent(
        '사업자번호',
        evalu.firmNumber
      )}${makeShareContent('장비', evalu.equipment)}${makeShareContent(
        '지역',
        evalu.local
      )}${makeSharePriceContent(
        '금액',
        formatNumber(evalu.amount)
      )}${makeShareContent(
        '피해내용', `\n${evalu.reason}`
      )}\n조회 시간: ${searchTime}\n\n자세한 내용은 무료가입 악덕공유 [장비 콜] 앱에서 확인해 주세요.\nhttps://play.google.com/store/apps/details?id=com.kan.jangbeecall`
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * 내가 작성한 피해사례 조회
 */
export const searchMyFirmHarmCase = (accountId: string): Promise<object> =>
{
    return api
      .getClientEvaluList(0, accountId, true);
};

function makeShareContent(title, content) {
  if (content) {
    return `\n${title}: ${content}`;
  }

  return '';
}

function makeSharePriceContent(title, content) {
  if (content) {
    return `\n${title}: ${content} 원`;
  }

  return '';
}

