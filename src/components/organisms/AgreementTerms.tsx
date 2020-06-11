import * as React from 'react';

import styled, { DefaultTheme } from 'styled-components/native';

import { CheckBox } from 'react-native-elements';
import { useLoginContext } from 'src/contexts/LoginContext';

interface StyleProps {
  theme: DefaultTheme;
}
const Container = styled.View`
`;
const RuleContents = styled.View``;
const ConfirmWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: 10;
`;
const ConfirmCheckWrap = styled.View``;
const ConfirmCheck = styled(CheckBox)``;
const RuleTitleWrap = styled.View`
  padding: 10px 20px;
  align-items: center;
  border-bottom-width: 1;
`;
const RuleTitle = styled.Text`
  font-size: 20;
  font-family: ${(props: StyleProps): string => props.theme.FontTitle};
  font-weight: bold;
`;
const ShowTermTO = styled.TouchableOpacity``;
const ShowTermTOText = styled.Text`
  text-decoration-line: underline;
`;

const TERM_URL_PHONEAUTH = 'https://jangbee-inpe21.firebaseapp.com/phoneAuthTerm.html';
const TERM_URL_SERVICE = 'https://jangbee-inpe21.firebaseapp.com/serviceTerms.html';
const TERM_URL_PRIVACY = 'https://jangbee-inpe21.firebaseapp.com/privacy.html';

interface Props {
  onChange: (agreement: boolean) => void;
}
const AgreementTerms: React.FC<Props> = (props) =>
{
  const { setWebViewModal } = useLoginContext();
  const [agreePhoneAuth, setAgreePhoneAuth] = React.useState(false);
  const [agreeUseTerm, setAgreeUseTerm] = React.useState(false);
  const [agreePrivateTerm, setAgreePrivateTerm] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  React.useMemo(() =>
  {
    if (agreePhoneAuth && agreeUseTerm && agreePrivateTerm) { setAgreeTerms(true) }
    if (!agreePhoneAuth || !agreeUseTerm || !agreePrivateTerm) { setAgreeTerms(false) }
  }, [agreePhoneAuth, agreeUseTerm, agreePrivateTerm]);

  React.useMemo(() =>
  {
    props.onChange(agreeTerms);
  }, [agreeTerms]);

  return (
    <Container>
      <RuleTitleWrap>
        <RuleTitle>이용약관 동의</RuleTitle>
      </RuleTitleWrap>
      <RuleContents>
        <ConfirmCheckWrap>
          <ConfirmCheck
            title='전체동의'
            checked={agreeTerms}
            onPress={(): void =>
            {
              setAgreeTerms(!agreeTerms);
              setAgreePhoneAuth(!agreeTerms);
              setAgreeUseTerm(!agreeTerms);
              setAgreePrivateTerm(!agreeTerms);
            }}
            iconRight
            right
          />
        </ConfirmCheckWrap>
        <ConfirmWrap>
          <ConfirmCheckWrap>
            <ConfirmCheck
              title='Google 전화번호 인증(전화번호 변경전, 탈퇴필수)'
              checked={agreePhoneAuth}
              onPress={(): void => { setAgreePhoneAuth(!agreePhoneAuth) }}
            />
          </ConfirmCheckWrap>
          <ShowTermTO onPress={(): void => setWebViewModal({ visible: true, url: TERM_URL_PHONEAUTH })}>
            <ShowTermTOText>내용 보기</ShowTermTOText>
          </ShowTermTO>
        </ConfirmWrap>
        <ConfirmWrap>
          <ConfirmCheckWrap>
            <ConfirmCheck
              title='서비스 이용약관'
              checked={agreeUseTerm}
              onPress={(): void => setAgreeUseTerm(!agreeUseTerm)}
            />
          </ConfirmCheckWrap>
          <ShowTermTO onPress={(): void => setWebViewModal({ visible: true, url: TERM_URL_SERVICE })}>
            <ShowTermTOText>내용 보기</ShowTermTOText>
          </ShowTermTO>
        </ConfirmWrap>
        <ConfirmWrap>
          <ConfirmCheckWrap>
            <ConfirmCheck
              title='개인 정보처리방침'
              checked={agreePrivateTerm}
              onPress={(): void => setAgreePrivateTerm(!agreePrivateTerm)}
            />
          </ConfirmCheckWrap>
          <ShowTermTO onPress={(): void => setWebViewModal({ visible: true, url: TERM_URL_PRIVACY })}>
            <ShowTermTOText>내용 보기</ShowTermTOText>
          </ShowTermTO>
        </ConfirmWrap>
      </RuleContents>
    </Container>
  );
};

export default AgreementTerms;
