import { Alert, Share } from 'react-native';
import { formatTelnumber } from '../utils/StringUtils';
import { formatNumber } from '../utils/NumberUtils';

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

export async function shareJBCall() {
  try {
    await Share.share({
      message:
        "나만 등록안하고 있던거야!? 어쩐지 일감이 늘지 않더라!!\n\n• '무료 내장비'에 등록해서 무료일감 전화를 받으세요. 놓치면 무조건 손해입니다.(화주 내주변 GPS검색 리스트에 뜹니다)\n※ 지역검색에선 현재 먼저 등록한 사람이 상위 랭크됩니다. 서두르세요!\n\n\n건설장비 이용에도 끊임없이 발전하는 변화가 필요합니다!\n\n[장비 콜]이 장비 기사님들의 소리를 듣고 고민하겠습니다.\n\n• 수금문제로 힘드시죠? 피해사례 데이터베이스 구축. 피해사례를(악덕) 등록하면 신고가 들어옵니다.\n\n\n안드로이드 런칭(베타 서비스중): https://play.google.com/store/apps/details?id=com.kan.jangbeecall&hl=ko&ah=CzkpyhBButhsnL34UAqWc2bsaGM",
    });
  } catch (error) {
    Alert.alert(error.message);
  }
}

export async function shareClientEvalu(evalu, searchTime) {
  try {
    await Share.share({
      message: `[${formatTelnumber(evalu.telNumber)}] 피해사례\n\n${makeShareContent(
        '이름',
        evalu.cliName,
      )}${makeShareContent('업체명', evalu.firmName)}${makeShareContent(
        '전화번호2',
        evalu.telNumber2,
      )}${makeShareContent('전화번호3', evalu.telNumber3)}${makeShareContent(
        '사업자번호',
        evalu.firmNumber,
      )}${makeShareContent('장비', evalu.equipment)}${makeShareContent(
        '지역',
        evalu.local,
      )}${makeSharePriceContent('금액', formatNumber(evalu.amount))}${makeShareContent(
        '피해내용',
        evalu.reason,
      )}\n조회 시간: ${searchTime}\n\n자세한 내용은 무료가입 악덕공유 [장비 콜] 앱에서 확인해 주세요.https://play.google.com/store/apps/details?id=com.kan.jangbeecall`,
    });
  } catch (error) {
    Alert.alert(error.message);
  }
}

export async function shareNotExistCEvalu(searchArea, filterStr, filterTime) {
  let searType;
  let searWord = filterStr;
  if (searchArea === 'CLI_NAME') {
    searType = '이름';
  } else if (searchArea === 'FIRM_NAME') {
    searType = '회사명';
  } else if (searchArea === 'TEL') {
    searType = '전화번호';
    searWord = formatTelnumber(filterStr);
  } else if (searchArea === 'FIRM_NUMBER') {
    searType = '사업자번호';
  }

  try {
    await Share.share({
      message: `[${searWord}] 피해사례 조회\n\n조회 타입: ${searType}\n조회 내용: ${searWord}\n조회 결과: 현재 피해사례가 없습니다\n조회 시간: ${filterTime}\n\n자세한 내용은 무료가입 악덕공유 [장비 콜] 앱에서 확인해 주세요.https://play.google.com/store/apps/details?id=com.kan.jangbeecall`,
    });
  } catch (error) {
    Alert.alert(error.message);
  }
}
