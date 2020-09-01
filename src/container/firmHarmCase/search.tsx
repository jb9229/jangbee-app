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
  const initMyHarmCaseSearch = props.navigation.getParam('myHarmCase', undefined);
  const initSearchAll = props.navigation.getParam('initSearchAll', true);

  return (
    <FirmHarmCaseSearchProvider
      navigation={props.navigation} searchWord={searchWord} initMyHarmCaseSearch={initMyHarmCaseSearch} initSearchAll={initSearchAll}
    >
      <FirmHarmCaseSearchLayout />
    </FirmHarmCaseSearchProvider>
  );
};

export default FirmHarmCaseSearchContainer;
