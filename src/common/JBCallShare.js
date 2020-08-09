import { Alert, Share } from 'react-native';

import { formatNumber } from 'utils/NumberUtils';
import { formatTelnumber } from 'utils/StringUtils';

export async function shareJBCall() {
  try {
    await Share.share({
      message:
        "나만 등록안하고 있던거야!? 어쩐지 일감이 늘지 않더라!!\n\n• '무료 내장비'에 등록해서 무료일감 전화를 받으세요. 놓치면 무조건 손해입니다.(화주 내주변 GPS검색 리스트에 뜹니다)\n※ 지역검색에선 현재 먼저 등록한 사람이 상위 랭크됩니다. 서두르세요!\n\n\n건설장비 이용에도 끊임없이 발전하는 변화가 필요합니다!\n\n[장비 콜]이 장비 기사님들의 소리를 듣고 고민하겠습니다.\n\n• 수금문제로 힘드시죠? 피해사례 데이터베이스 구축. 피해사례를(악덕) 등록하면 신고가 들어옵니다.\n\n\n안드로이드 런칭(베타 서비스중): https://play.google.com/store/apps/details?id=com.kan.jangbeecall&hl=ko&ah=CzkpyhBButhsnL34UAqWc2bsaGM"
    });
  } catch (error) {
    Alert.alert(error.message);
  }
}
