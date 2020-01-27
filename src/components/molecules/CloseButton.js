import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import React from 'react';
import colors from 'constants/Colors';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  justify-content: ${(props) => props.align ? props.align : 'flex-end'};
  padding-top: 10;
  padding-right: 10;
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

export default function CloseButton ({ onClose, align })
{
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
