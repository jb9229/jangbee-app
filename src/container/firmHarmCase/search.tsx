import * as React from 'react';

import { ClientEvaluParamList } from 'src/navigation/types';
import FirmHarmCaseSearchLayout from 'src/components/templates/FirmHarmCaseSearchLayout';
import FirmHarmCaseSearchProvider from './FirmHarmCaseSearchProvider';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<ClientEvaluParamList, 'FirmHarmCaseSearch'>;
  route: RouteProp<ClientEvaluParamList, 'FirmHarmCaseSearch'>;
}
const FirmHarmCaseSearchContainer: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const {
    searchWord,
    initSearch,
    initSearchAll,
    initSearchMine,
  } = route.params;

  return (
    <FirmHarmCaseSearchProvider
      navigation={navigation}
      searchWord={searchWord}
      initSearch={initSearch}
      initSearchAll={initSearchAll}
      initSearchMine={initSearchMine}
    >
      <FirmHarmCaseSearchLayout />
    </FirmHarmCaseSearchProvider>
  );
};

export default FirmHarmCaseSearchContainer;
