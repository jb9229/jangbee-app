import * as React from 'react';

import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

const Title = styled.Text`
  font-family: ${fonts.title};
  font-size: 16;
  font-weight: 500;
`;
interface Props {
  testID: string;
  errorText: string;
}
const TitleText: React.FC<Props> = (props) =>
{
  return (
    <Title testID={props.testID}>{props.children}</Title>
  );
};

export default TitleText;
