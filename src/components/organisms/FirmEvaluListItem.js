import { Rating } from 'react-native-elements';
import React from 'react';
import Styled from 'styled-components/native';
import { View } from 'react-native';
import fonts from 'constants/Fonts';
import { formatHideTelnumber } from 'utils/StringUtils';

const Container = Styled.View`
  margin: 5px;
  marginBottom: 7px;
`;

const TopWrap = Styled.View`
  flexDirection: row;
  marginLeft: 3px;
  marginBottom: 5px;
  alignItems: center;
  justify-content: space-between;
`;

const PhoneText = Styled.Text`
  font-family: ${fonts.title};
  margin-left: 7px;
`;

const DateText = Styled.Text`
  font-family: ${fonts.title};
  margin-left: 7px;
`;

const CommentText = Styled.Text`
  font-family: ${fonts.batang};
  margin-left: 3px;
`;

export default function FirmEvaluListItem ({ item })
{
  return (
    <Container>
      <TopWrap>
        <Rating
          type="custom"
          imageSize={15}
          readonly
          startingValue={item.rating}
        />
        <View>
          <PhoneText>{formatHideTelnumber(item.phoneNumber)}</PhoneText>
          <DateText>{item.regiDate}</DateText>
        </View>
      </TopWrap>
      <CommentText>{item.comment}</CommentText>
    </Container>
  );
}
