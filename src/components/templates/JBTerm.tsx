import JBButton from 'molecules/JBButton';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import { openLinkUrl } from 'utils/LinkUtil';
import pkg from 'app.json';
import { shareJBCall } from 'common/JBCallShare';
import styled from 'styled-components/native';
import url from 'constants/Url';

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

const TelHO = styled.TouchableOpacity`
  padding: 1px;
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

const TelText = styled.Text`
  font-family: ${fonts.title};
  font-size: 13;
  text-decoration-line: underline;
  background-color: ${colors.point2Light};
  padding: 1px;
  padding-left: 4px;
  padding-right: 4px;
  margin: 2px;
`;

export default function JBTerm ({ bg })
{
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
          <Title>상담:</Title>
          <Text>내정보 -> 카톡상담하기 클릭</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Title>기술 문의:</Title>
          <TelHO onPress={() => openLinkUrl('tel:010-5202-3337')}>
            <TelText>010-5202-3337</TelText>
          </TelHO>
        </Column>
        <Column>
          <Title>개인정보관리책임자:</Title>
          <Text>정진범</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Title>대표:</Title>
          <TelHO onPress={() => openLinkUrl('tel:010-8755-7407')}>
            <TelText>010-8755-7407</TelText>
          </TelHO>
        </Column>
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
        <Column>
          <Title>Version: </Title>
          <Text>{`${pkg.mode}_${pkg.expo.version}`}</Text>
        </Column>
        <Column>
          <JBButton
            title="이용 안내"
            size="small"
            underline
            onPress={() => openLinkUrl(url.TERM_USEINFO)}
          />
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
        <JBButton
          title="장비 콜 공유하기"
          onPress={() => shareJBCall()}
          size="small"
          Primary
        />
      </Row>
    </Container>
  );
}