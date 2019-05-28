import React from 'react';
import { StyleSheet, Text, Picker } from 'react-native';
import styled from 'styled-components/native';
import fonts from '../../constants/Fonts';
import colors from '../../constants/Colors';

const Container = styled.View`
  ${props => props.size
    && `
    width: ${props.size};
  `}
  margin: 0px 10px;
`;

const TitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  font-family: ${fonts.titleMiddle};
  color: ${colors.title};
  font-size: 15;
  margin-bottom: 3;
  ${props => props.fill
    && `
    color: ${colors.point2};
  `}
`;

const SubTitle = styled.Text`
  font-family: ${fonts.title};
  color: ${colors.titleDark};
  font-size: 12;
`;

const styles = StyleSheet.create({
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3,
  },
  itemPicker: {},
});

export default function JBPicker({
  title,
  subTitle,
  selectedValue,
  items,
  onValueChange,
  size,
  selectLabel,
}) {
  return (
    <Container size={size}>
      <TitleWrap>
        {title && <Title fill={!!selectedValue}>{title}</Title>}
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
      </TitleWrap>
      <Picker
        selectedValue={selectedValue}
        style={styles.itemPicker}
        onValueChange={itemValue => onValueChange(itemValue)}
      >
        <Picker.Item label={selectLabel || '선택'} value="" key={-1} />
        {items}
      </Picker>
    </Container>
  );
}
