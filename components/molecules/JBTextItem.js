import React from 'react';
import styled from 'styled-components/native';
import fonts from '../../constants/Fonts';

const Container = styled.View`
  flex: 1;
  align-items: flex-start;
  margin: 10px;
  margin-bottom: 20px;
  ${props => props.row
    && `
    flex-direction: row;
    align-items: center;
  `}
  ${props => props.small
    && `
    margin: 5px;
    margin-bottom: 5px;
  `}
`;

const Title = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 18px;
  margin-bottom: 10px;
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

const Contents = styled.Text`
  font-family: ${fonts.batang};
  font-size: 14px;
  ${props => props.underline !== undefined
    && `
    text-decoration-line: underline;
  `}
  ${props => !props.row
    && `
    margin-left: 5;
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
      title, value, revColor, underline, row, small, secondeValue,
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
        <Title small={small} row={row}>
          {title === undefined ? '' : `${title}: `}
        </Title>
        <Contents underline={underline} noneTitle={title === undefined} row={row}>
          {valueText}
        </Contents>
        {secondeValue && (
          <Contents underline={underline} row={row}>
            {secondeValue}
          </Contents>
        )}
      </Container>
    );
  }
}
