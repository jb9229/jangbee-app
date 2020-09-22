import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import FirmHarmCaseSearchLayout from 'src/components/templates/FirmHarmCaseSearchLayout';
import FirmHarmCaseSearchProvider from './FirmHarmCaseSearchProvider';

interface Props {
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseSearchContainer: React.FC<Props> = (props) =>
{
  const searchWord = props.navigation.getParam('searchWord', undefined);
  const initSearch = props.navigation.getParam('initSearch', undefined);
  const initSearchAll = props.navigation.getParam('initSearchAll', undefined);
  const initSearchMine = props.navigation.getParam('initSearchMine', undefined);

  return (
    <FirmHarmCaseSearchProvider
      navigation={props.navigation}
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
