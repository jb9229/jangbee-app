import React from 'react';
import { Alert, Share } from 'react-native';
import styled from 'styled-components/native';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import JBButton from './molecules/JBButton';
import * as url from '../constants/Url';
import { openLinkUrl } from '../utils/LinkUtil';

const Container = styled.View`
  padding: 8px;
  padding-top: 12px;
  background-color: ${props => (props.bg ? props.bg : colors.batangLight)};
  margin: 8px;
  margin-top: 12px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Column = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  font-family: ${fonts.title};
  font-size: 11;
`;

const Text = styled.Text`
  font-family: ${fonts.title};
  font-size: 13;
  background-color: ${colors.point2Light};
  padding: 1px;
  padding-left: 4px;
  padding-right: 4px;
  margin: 2px;
`;

async function shareJBCall() {
  try {
    const result = await Share.share({
      message: `나만 등록안하고 있던거야!? 어쩐지 일감이 늘지 않더라!!\n\n
      • '무료 내장비'에 등록해서 무료일감 전화를 받으세요. 놓치면 무조건 손해입니다.(화주 내주변 GPS검색 리스트에 뜹니다)\n
      ※ 지역검색에선 현재 먼저 등록한 사람이 상위 랭크됩니다. 서두르세요!\n\n\n
      건설장비 이용에도 끊임없이 발전하는 변화가 필요합니다!\n\n
      [장비 콜]이 장비 기사님들의 소리를 듣고 고민하겠습니다.\n\n
      • 수금문제로 힘드시죠? 피해사례 데이터베이스 구축. 피해사례를(악덕) 등록하면 신고가 들어옵니다.\n\n\n
      안드로이드 런칭(베타 서비스중): https://play.google.com/store/apps/details?id=com.kan.jangbeecall&hl=ko&ah=CzkpyhBButhsnL34UAqWc2bsaGM`,
    });
  } catch (error) {
    Alert.alert(error.message);
  }
}

export default function renderJBTerm({ bg }) {
  return (
    <Container bg={bg}>
      <Row>
        <Column>
          <Title>회사:</Title>
          <Text>장비 콜</Text>
        </Column>
        <Column>
          <Title>대표:</Title>
          <Text>나채범</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Title>주소:</Title>
          <Text>충청북도 영동군 용산면 한곡리길 40</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Title>전화번호:</Title>
          <Text>010-8577-7407</Text>
        </Column>
        <Column>
          <Title>개인정보관리책임자:</Title>
          <Text>정진범</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Title>이메일:</Title>
          <Text>support@jangbeecall.com</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Title>사업자번호:</Title>
          <Text>111-07-51491</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Title>직업정보제공사업면허:</Title>
          <Text>J1711020190001호</Text>
        </Column>
      </Row>
      <Row>
        <JBButton
          title="서비스 이용약관"
          size="small"
          underline
          onPress={() => openLinkUrl(url.TERM_SERVICE)}
        />
        <JBButton
          title="개인정보처리방침"
          size="small"
          underline
          onPress={() => openLinkUrl(url.TERM_SECURITY)}
        />
      </Row>
      <Row>
        <Column>
          <Title>@2019 장비 콜 All rights reserved.</Title>
        </Column>
        <JBButton title="장비 콜 공유하기" onPress={() => shareJBCall()} size="small" Primary />
      </Row>
    </Container>
  );
}
