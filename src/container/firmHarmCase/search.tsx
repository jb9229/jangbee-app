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
  const searchWord = props.navigation.getParam('searchWord', undefined);
  const initMyHarmCaseSearch = props.navigation.getParam('myHarmCase', undefined);

  return (
    <FirmHarmCaseSearchProvider navigation={props.navigation} searchWord={searchWord} initMyHarmCaseSearch={initMyHarmCaseSearch}>
      <FirmHarmCaseSearchLayout />
    </FirmHarmCaseSearchProvider>
  );
};

export default FirmHarmCaseSearchContainer;