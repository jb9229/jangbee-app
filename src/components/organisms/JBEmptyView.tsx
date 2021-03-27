import JBButton from 'molecules/JBButton';
import React from 'react';
import Styled from 'styled-components/native';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';

const Container = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NoticeWrap = Styled.View`
  marginBottom: 10px;
  align-items: center;
`;

const Text = Styled.Text`
  font-family: ${fonts.batang};
  font-size: 18px;
  color: ${colors.batang};
`;
export default function JBEmptyView({ title, subTitle, refresh, actionName }) {
  return (
    <Container>
      <NoticeWrap>
        <Text>{title}</Text>
        {subTitle && <Text>{subTitle}</Text>}
      </NoticeWrap>
      <JBButton title={actionName || '새로고침'} onPress={() => refresh()} />
    </Container>
  );
}
