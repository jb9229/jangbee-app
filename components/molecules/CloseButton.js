import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/Colors';

const Container = styled.View`
  flex-direction: row;
  ${props => props.align
    && `
    justify-content: ${props.align};
    padding-right: 10;
  `}
`;
const TouchableHighlight = styled.TouchableHighlight`
  background-color: ${colors.pointBatang};
  padding-left: 7px;
  padding-right: 7px;
  margin: 4px;
  margin-bottom: 3px;
  border-width: 1;
  border-radius: 30;
  border-color: ${colors.iconDefault};
  elevation: 10;
`;

export default function CloseButton({ onClose, align }) {
  return (
    <Container align={align}>
      <TouchableHighlight onPress={onClose}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
          size={30}
          color={colors.iconDefault}
        />
      </TouchableHighlight>
    </Container>
  );
}
