import { StyleSheet, TextInput } from 'react-native';

import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

const Container = styled.View`
  ${props =>
    props.row &&
    `
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  `}
  margin-top: 15;
`;

const Title = styled.Text`
  font-family: ${fonts.titleMiddle};
  color: ${colors.titleDark};
  font-size: 15;
  ${props =>
    props.fill &&
    `
    color: ${colors.point2};
  `}
`;

const TitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8;
`;

const SubTitle = styled.Text`
  font-family: ${fonts.title};
  color: ${colors.pointDark};
  font-size: 12;
`;

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    margin: 10,
    marginBottom: 20
  },
  itemTitle: {},
  itemInput: {
    fontFamily: fonts.batang,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#7A7373',
    borderStyle: 'dotted'
  }
});

export default class JBTextInput extends React.PureComponent
{
  render ()
  {
    const {
      row,
      title,
      subTitle,
      value,
      placeholder,
      onChangeText,
      keyboardType,
      secureTextEntry,
      onFocus,
      multiline,
      numberOfLines,
      tiRefer,
      editable,
      onEndEditing,
      onSubmitEditing
    } = this.props;
    return (
      <Container row={row}>
        <TitleWrap>
          {title && <Title fill={!!value}>{title}</Title>}
          {subTitle && <SubTitle>{subTitle}</SubTitle>}
        </TitleWrap>
        <TextInput
          ref={tiRefer ? input => tiRefer(input) : null}
          style={styles.itemInput}
          value={value}
          secureTextEntry={secureTextEntry !== undefined}
          keyboardType={keyboardType === undefined ? 'default' : keyboardType}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onFocus={onFocus}
          multiline={multiline !== undefined}
          numberOfLines={numberOfLines === undefined ? 1 : numberOfLines}
          ellipsizeMode="tail"
          blurOnSubmit={false}
          editable={editable}
          onEndEditing={onEndEditing}
          onSubmitEditing={onSubmitEditing}
        />
      </Container>
    );
  }
}
