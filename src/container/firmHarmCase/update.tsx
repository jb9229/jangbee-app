import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import FirmHarmCaseUpdateLayout from './FirmHarmCaseUpdateLayout';
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
    <FirmHarmCaseUpdateLayout />
  );
};

export default FirmHarmCaseSearchContainer;