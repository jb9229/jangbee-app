import React from 'react';
import styled from 'styled-components/native';
import fonts from '../../constants/Fonts';
import colors from '../../constants/Colors';
import { ellipsisStr } from '../../utils/StringUtils';

const Container = styled.View`
  flex: 1;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom-width: 1;
  border-radius: 10;
  border-color: rgba(130, 182, 237, 0.5);
  padding: 7px 7px;
  flex-wrap: wrap;
  ${props => props.row
    && `
    flex-direction: row;
  `}
  ${props => props.small
    && `
    margin: 5px;
    margin-bottom: 5px;
  `};
`;
const TitleWrap = styled.View`
  ${props => props.titleSize
    && `
      width: ${props.titleSize};
  `};
  ${props => !props.row
    && `
    flex: 1;
  `}
  ${props => props.row
    && `
    flex-basis: 80;
    width: 80;
  `}
`;

const Title = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 16px;
  margin-bottom: 10px;
  color: ${colors.batangDark};

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
  ${props => !props.row
    && `
    margin-left: ${props.titleSize ? props.titleSize : 80};
  `}
`;

const Contents = styled.Text`
  font-family: ${fonts.batang};
  font-size: 14px;
  color: ${colors.batangDark};
  ${props => props.underline !== undefined
    && `
    text-decoration-line: underline;
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
        <TitleWrap row={row} titleSize={titleSize}>
          <Title small={small} row={row}>
            {title === undefined ? '' : `${title} `}
          </Title>
        </TitleWrap>
        <ContentsWrap row={row} titleSize={titleSize}>
          <Contents underline={underline} noneTitle={title === undefined} numberOfLines={4}>
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
