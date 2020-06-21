import * as React from 'react';

import { StyleProp, ViewStyle } from 'react-native';

import styled from 'styled-components/native';

const Container = styled.View``;

interface Props {
  wrapperStyle: StyleProp<ViewStyle>;
}
const CName: React.FC<Props> = (props) =>
{
  return (
    <Container style={props.wrapperStyle}>

    </Container>
  );
};

export default CName;
