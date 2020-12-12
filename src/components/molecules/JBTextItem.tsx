import React from 'react';
import colors from 'constants/Colors';
import { ellipsisStr } from 'utils/StringUtils';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

interface StyleProps {
  row?: boolean;
  small?: boolean;
  titleSize?: number;
  underline?: boolean;
}
const Container = styled.View`
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom-width: 1;
  border-radius: 10;
  border-color: rgba(130, 182, 237, 0.5);
  padding: 7px 7px;
  flex-wrap: wrap;
  ${(props: StyleProps): string => props.row && 'flex-direction: row'};
  ${(props: StyleProps) => props.small && 'margin: 5px; margin-bottom: 5px'};
`;
const TitleWrap = styled.View`
  ${(props: StyleProps) => !props.row && 'flex: 1'};
  ${(props: StyleProps) => props.row && 'flex-basis: 80;width: 80'};
  ${(props: StyleProps) => props.titleSize && `width: ${props.titleSize}`};
`;

const Title = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 16px;
  margin-bottom: 10px;
  color: ${colors.batangDark};

  ${(props: StyleProps) => props.underline !== undefined && 'text-decoration-line: underline'};
  ${(props: StyleProps) => props.small && 'font-size: 14px'};
  ${(props: StyleProps) => props.row && 'margin-bottom: 0px'};
`;

const ContentsWrap = styled.View`
  ${(props: StyleProps) => !props.row && `margin-left: ${props.titleSize ? props.titleSize : 80}`};
`;

const Contents = styled.Text`
  font-family: ${fonts.batang};
  font-size: 14px;
  color: ${colors.batangDark};
  ${props =>
    props.underline !== undefined &&
    `
    text-decoration-line: underline;
  `}
  ${props =>
    props.noneTitle &&
    `
    font-family: ${fonts.title};
    margin-left: 0;
    font-size: 14px;
    font-weight: 400;
  `}
`;

interface Props {
  title: string;
  value: string;
  row?: boolean;
  small: boolean;
  secondeValue?: string;
  underline?: boolean;
  titleSize?: number;
  ellipsis?: number;
}
const JBTextItem: React.FC<Props> = (props) =>
{
  let valueText = props.value;
  if (!props.value)
  {
    valueText = '-';
  }
  return (
    <Container row={props.row} small={props.small}>
      <TitleWrap row={props.row} titleSize={props.titleSize}>
        <Title small={props.small} row={props.row}>
          {props.title || ''}
        </Title>
      </TitleWrap>
      <ContentsWrap row={props.row} titleSize={props.titleSize}>
        <Contents
          underline={props.underline}
          noneTitle={props.title === undefined}
          numberOfLines={4}
        >
          {props.ellipsis ? ellipsisStr(valueText, props.ellipsis) : valueText}
        </Contents>
        {props.secondeValue && (
          <Contents underline={props.underline} row={props.row}>
            {props.secondeValue}
          </Contents>
        )}
      </ContentsWrap>
    </Container>
  );
};

export default JBTextItem;
