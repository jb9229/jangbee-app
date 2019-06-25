import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/Colors';

const Container = styled.View`
  flex-direction: row;
`;
const TouchableHighlight = styled.TouchableHighlight`
  background-color: ${colors.pointBatang};
  padding-left: 5px;
  padding-right: 5px;
  margin: 5px;
  border-width: 1;
  border-radius: 30;
  border-color: ${colors.iconDefault};
  elevation: 10;
`;

export default function CloseButton({ onClose }) {
  return (
    <Container>
      <TouchableHighlight onPress={onClose}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
          size={33}
          color={colors.iconDefault}
        />
      </TouchableHighlight>
    </Container>
  );
}
