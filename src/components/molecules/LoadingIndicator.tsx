import { Alert } from 'react-native';
import { DefaultNavigationProps } from '../../types';
import Modal from './OptionModal/Modal';
import React from 'react';
import getString from '../../STRINGS';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const Message = styled.Text`
  font-size: 15;
  font-family: Rubik-Medium;
  margin-bottom: 20;
`;

const ActivityIndicator = styled.ActivityIndicator`
`;

interface Props {
  navigation: DefaultNavigationProps;
  visible: boolean;
  loadingMSG?: string;
  size?: number;
  modal?: boolean;
  // force close only for modal
  forceCloseTime?: number; // Default Time is 15000, If you're going to be doing long work, increase the value
  forceCloseAction?: () => void; // Default Action is 'props.navigation.goBack()'
}

let forceCloseTimeout: NodeJS.Timeout | undefined;
const LoadingIndicator: React.FC<Props> = (props) => {
  React.useEffect((): void => {
    if (props.modal)
    {
      if (props.visible && !forceCloseTimeout) {
        forceCloseTimeout = setTimeout(() => {
          if (props.visible) {
            Alert.alert('Loading Indicator was forced off!', 'It is too long work, please try again');
            props.forceCloseAction ? props.forceCloseAction() : props.navigation.goBack();
          }
        }, props.forceCloseTime || 15000);
      }

      if (!props.visible && forceCloseTimeout)
      {
        clearTimeout(forceCloseTimeout);
        forceCloseTimeout = undefined;
      }

      return (): void =>
      {
        if (forceCloseTimeout)
        {
          clearTimeout(forceCloseTimeout);
          forceCloseTimeout = undefined;
        }
      };
    }
  }, [props.visible]);

  if (props.modal && props.visible !== undefined) {
    return (
      <Modal
        loading
        visible={props.visible}
        contents={
          <LoadingContainer>
            <Message>{props.loadingMSG || getString('LOADING')}</Message>
            <ActivityIndicator size={props.size || 28} color="#7B57af"/>
          </LoadingContainer>
        }
      />
    );
  }
  return (
    <Container>
      <Message>{props.loadingMSG || getString('LOADING')}</Message>
      <ActivityIndicator size={props.size || 28} color="#7B57af"/>
    </Container>
  );
};

export default withNavigation(LoadingIndicator);
