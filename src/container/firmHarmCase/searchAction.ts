import * as api from 'api/api';

import { CallHistory, CallHistoryType } from './type';

import { Share } from 'react-native';
import { formatNumber } from 'src/utils/NumberUtils';
import { formatTelnumber } from 'src/utils/StringUtils';

function makeShareContent (title, content): string
{
  if (content)
  {
    return `\n${title}: ${content}`;
  }

  return '';
}

function makeSharePriceContent (title, content): string
{
  if (content)
  {
    return `\n${title}: ${content} 원`;
  }

  return '';
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

  try
  {
    Share.share({
      message: `[${searWord}] 피해사례 조회\n\n조회: ${searWord}\n결과: 현재 피해사례가 없습니다\n조회 시간: ${filterTime}\n\n자세한 내용은 무료가입 악덕공유 [장비 콜] 앱에서 확인해 주세요.\nhttps://play.google.com/store/apps/details?id=com.kan.jangbeecall`
    });
  }
  catch (error)
  {
    console.error(error);
  }
};

export const shareClientEvalu = (evalu, searchTime): void =>
{
  try
  {
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
  }
  catch (error)
  {
    console.error(error);
  }
};

/**
 * 내가 작성한 피해사례 조회
 */
export const searchMyFirmHarmCase = (accountId: string): Promise<object> =>
{
  return api
    .getClientEvaluList(0, accountId, true);
};

export function shareJBCall (): void
{
  try
  {
    Share.share({
      message:
        "나만 등록안하고 있던거야!? 어쩐지 일감이 늘지 않더라!!\n\n• '무료 내장비'에 등록해서 무료일감 전화를 받으세요. 놓치면 무조건 손해입니다.(화주 내주변 GPS검색 리스트에 뜹니다)\n※ 지역검색에선 현재 먼저 등록한 사람이 상위 랭크됩니다. 서두르세요!\n\n\n건설장비 이용에도 끊임없이 발전하는 변화가 필요합니다!\n\n[장비 콜]이 장비 기사님들의 소리를 듣고 고민하겠습니다.\n\n• 수금문제로 힘드시죠? 피해사례 데이터베이스 구축. 피해사례를(악덕) 등록하면 신고가 들어옵니다.\n\n\n안드로이드 런칭(베타 서비스중): https://play.google.com/store/apps/details?id=com.kan.jangbeecall&hl=ko&ah=CzkpyhBButhsnL34UAqWc2bsaGM"
    });
  }
  catch (error)
  {
    alert(error.message);
  }
}
