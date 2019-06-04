import React from 'react';
import styled from 'styled-components/native';
import fonts from '../../constants/Fonts';
import colors from '../../constants/Colors';
import { ellipsisStr } from '../../utils/StringUtils';

const Container = styled.View`
  flex: 1;
  align-items: flex-start;
  margin-bottom: 20px;
  border-width: 1;
  border-radius: 10;
  border-color: ${colors.point2}
  padding: 3px 7px;
  flex-wrap: wrap;
  ${props => props.row
    && `
    flex-direction: row;
    align-items: center;
  `}
  ${props => props.small
    && `
    margin: 5px;
    margin-bottom: 5px;
  `};
`;
const TitleWrap = styled.View`
  flex: 1;
  ${props => props.titleSize
    && `
      width: ${props.titleSize};
  `};
`;

const Title = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 16px;
  margin-bottom: 10px;
  color: ${colors.batang};

  ${props => props.underline !== undefined
    && `
    text-decoration-line: underline;
  `}
  ${props => props.small
    && `
    font-size: 14px;
  `}
  ${props => props.row
    && `
    margin-bottom: 0px;
  `}
`;

const ContentsWrap = styled.View`
  flex: 1;
`;

const Contents = styled.Text`
  font-family: ${fonts.batang};
  font-size: 14px;
  color: ${colors.batangDark};
  ${props => props.underline !== undefined
    && `
    text-decoration-line: underline;
  `}
  margin-left: 10;
  ${props => !props.row
    && `
    margin-left: 70;
  `}
  ${props => props.noneTitle
    && `
    font-family: ${fonts.title};
    margin-left: 0;
    font-size: 14px;
    font-weight: 400;
  `}
`;

export default class JBTextItem extends React.PureComponent {
  render() {
    const {
      title,
      value,
      revColor,
      underline,
      row,
      small,
      secondeValue,
      titleSize,
      ellipsis,
    } = this.props;
    let color = null;
    if (revColor) {
      color = { color: 'white' };
    }

    let valueText = value;
    if (!value) {
      valueText = '-';
    }
    return (
      <Container row={row} small={small}>
        <TitleWrap titleSize={titleSize}>
          <Title small={small} row={row}>
            {title === undefined ? '' : `${title} `}
          </Title>
        </TitleWrap>
        <ContentsWrap>
          <Contents
            underline={underline}
            noneTitle={title === undefined}
            row={row}
            numberOfLines={4}
          >
            {ellipsis ? ellipsisStr(valueText, ellipsis) : valueText}
          </Contents>
          {secondeValue && (
            <Contents underline={underline} row={row}>
              {secondeValue}
            </Contents>
          )}
        </ContentsWrap>
      </Container>
    );
  }
}
