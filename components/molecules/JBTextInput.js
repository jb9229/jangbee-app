import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import styled from 'styled-components/native';
import fonts from '../../constants/Fonts';
import colors from '../../constants/Colors';

<<<<<<< HEAD
const Container = styled.View`
  ${props => props.row
    && `
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  `}
`;

=======
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
const Title = styled.Text`
  font-family: ${fonts.titleMiddle};
  color: ${colors.titleDark};
  font-size: 15;
  margin-bottom: 3;
  ${props => props.fill
    && `
    color: ${colors.point2};
  `}
`;

const TitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
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
    marginBottom: 20,
  },
  itemTitle: {},
  itemInput: {
    fontFamily: fonts.batang,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#7A7373',
    borderStyle: 'dotted',
  },
});

export default class JBTextInput extends React.PureComponent {
  render() {
    const {
<<<<<<< HEAD
      row,
=======
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
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
<<<<<<< HEAD
      editable,
    } = this.props;
    return (
      <Container row={row}>
=======
    } = this.props;
    return (
      <View style={styles.itemWrap}>
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
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
<<<<<<< HEAD
          editable={editable}
        />
      </Container>
=======
        />
      </View>
>>>>>>> 4fe4d1bf290305a261ffc4a9ad5a07874dd7912b
    );
  }
}
