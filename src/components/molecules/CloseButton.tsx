import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import React from 'react';
import colors from 'constants/Colors';
import styled from 'styled-components/native';

interface StyledProps {
  align?: string;
}
const Container = styled.View<StyledProps>`
  flex-direction: row;
  justify-content: ${props => (props.align ? props.align : 'flex-end')};
  padding-top: 10;
  padding-right: 10;
`;
const IConTO = styled.TouchableOpacity`
  background-color: ${colors.pointBatang};
  padding-left: 7px;
  padding-right: 7px;
  margin: 4px;
  margin-bottom: 3px;
  border-width: 1px;
  border-radius: 30;
  border-color: ${colors.iconDefault};
  elevation: 10;
`;

interface Props {
  align?: string;
  onClose: () => void;
}
const CloseButton: React.FC<Props> = props => {
  return (
    <Container align={props.align}>
      <IConTO onPress={props.onClose}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
          size={30}
          color={colors.iconDefault}
        />
      </IConTO>
    </Container>
  );
};

export default CloseButton;
