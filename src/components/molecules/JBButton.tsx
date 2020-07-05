import { InteractionManager } from 'react-native';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

const FULL_SIZE = 'full';
const BIG_SIZE = 'big';
const SMALL_SIZE = 'small';
const Container = styled.View`
  flex-direction: row;
  margin: 5px;
  ${props =>
    props.align === 'right' &&
    `
    justify-content: flex-end;
  `}
  ${props =>
    props.align === 'center' &&
    `
    justify-content: center;
  `}
  ${props =>
    props.nonemargin &&
    `
    margin: 0px;
  `}
`;

const TouchableOpacity = styled.TouchableOpacity`
  border-color: ${props =>
    props.borderColor ? props.borderColor : colors.pointDark};

  border-width: 1px;
  ${props =>
    props.color &&
    `
    background-color: ${props.color};
  `};
  ${props =>
    props.size === undefined &&
    `
    padding: 12px 20px;
    border-radius: 3;
  `};
  ${props =>
    props.size === FULL_SIZE &&
    `
    width: 100%;
    align-items: center;
    padding: 10px 0;
    border-radius: 3;
    elevation: 4;
    border-width: 0;
  `};
  ${props =>
    props.size === BIG_SIZE &&
    `
    padding: 15px 30px;
    border-radius: 3;
    elevation: 2;
  `};
  ${props =>
    props.size === SMALL_SIZE &&
    `
    padding: 10px 10px;
    border-radius: 3;
  `};
  ${props =>
    props.underline &&
    `
    background-color: transparent;
    border-width: 0;
    elevation: 0;
  `};
`;

const Text = styled.Text`
  font-family: ${fonts.button};
  font-weight: bold;
  color: ${props => (props.color ? props.color : colors.pointDark)};
  ${props =>
    props.size === undefined &&
    `
      font-size: 20px;
  `};
  ${props =>
    props.size === FULL_SIZE &&
    `
      font-size: 21px;
    `};
  ${props =>
    props.size === BIG_SIZE &&
    `
      font-size: 25px;
    `};
  ${props =>
    props.size === SMALL_SIZE &&
    `
      font-size: 14px;
    `};
  ${props =>
    props.underline &&
    `
      color: ${props.color ? props.color : props.point2};
      text-decoration-line: underline;
    `};
`;

export default class JBButton extends React.PureComponent
{
  constructor (props)
  {
    super(props);
    this.state = {
      pressing: false
    };
  }

  preventDoubleTap = () =>
  {
    const { onPress } = this.props;
    const { pressing } = this.state;

    if (pressing === false)
    {
      this.setState({ pressing: true });

      onPress();

      InteractionManager.runAfterInteractions(() =>
      {
        this.setState({ pressing: false });
      });
    }
  };

  render ()
  {
    const {
      title,
      size,
      underline,
      color,
      bgColor,
      align,
      Secondary,
      Primary,
      nonemargin
    } = this.props;

    let colorTheme = color;
    let bgColorTheme = bgColor;

    if (Secondary)
    {
      if (underline)
      {
        colorTheme = colors.pointDark;
      }
      else
      {
        colorTheme = 'white';
      }

      bgColorTheme = colors.pointDark;
    }

    if (Primary)
    {
      if (underline)
      {
        colorTheme = colors.point2;
      }
      else
      {
        colorTheme = 'white';
      }

      bgColorTheme = colors.point2;
    }

    return (
      <Container align={align} nonemargin={nonemargin}>
        <TouchableOpacity
          size={size}
          color={bgColorTheme}
          borderColor={colorTheme}
          onPress={this.preventDoubleTap}
          underline={underline ? true : null}
        >
          <Text
            size={size}
            color={colorTheme}
            underline={underline ? true : null}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </Container>
    );
  }
}
