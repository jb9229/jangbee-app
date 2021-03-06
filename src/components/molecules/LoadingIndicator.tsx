import * as React from 'react';

import styled, { DefaultTheme } from 'styled-components/native';

import { ActivityIndicator } from 'react-native';
import getString from 'src/STRING';

interface StyledCProps {
  theme: DefaultTheme;
}

const Container = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Message = styled.Text`
  font-size: 16;
  margin-top: 20;
  margin-bottom: 20px;
  color: white;
`;

interface Props {
  loading: boolean;
  msg?: string;
  size?: number;
}
const LoadingIndicator: React.FC<Props> = props => {
  const [showLoading, setShowLoading] = React.useState(props.loading);
  const [forceCloseTimeout, setForceCloseTimeout] = React.useState();

  React.useEffect(() => {
    if (props.loading) {
      setShowLoading(true);
      const timer = setTimeout(() => {
        alert('실패!');
        setShowLoading(false);
      }, 10000);

      setForceCloseTimeout(timer);
    } else {
      setShowLoading(false);
      if (forceCloseTimeout) {
        clearTimeout(forceCloseTimeout);
      }
    }
  }, [props.loading]);
  if (showLoading) {
    return (
      <Container>
        <ActivityIndicator size={props.size || 50} color="white" />
        <Message>{props.msg || getString('LOADING')}</Message>
      </Container>
    );
  }
  return <></>;
};

export default LoadingIndicator;
