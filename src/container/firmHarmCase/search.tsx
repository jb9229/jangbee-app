import * as React from 'react';

import { StyleProp, ViewStyle } from 'react-native';

import { DefaultNavigationProps } from 'src/types';
import FirmHarmCaseSearchLayout from 'src/components/templates/FirmHarmCaseSearchLayout';
import FirmHarmCaseSearchProvider from './FirmHarmCaseSearchProvider';
import styled from 'styled-components/native';

const Container = styled.View``;

interface Props {
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseSearchContainer: React.FC<Props> = (props) =>
{
  // static navigationOptions = () => ({
  //   title: '장비 업체정보'
  // });

  return (
    <FirmHarmCaseSearchProvider navigation={props.navigation}>
      <FirmHarmCaseSearchLayout />
    </FirmHarmCaseSearchProvider>
  );
};

export default FirmHarmCaseSearchContainer;