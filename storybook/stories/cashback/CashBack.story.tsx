import * as React from 'react';

import CashBackLayout from 'src/container/cashback/CashBackLayout';
import { storiesOf } from '@storybook/react-native';

storiesOf('캐쉬백', module)
  .add('상세', () => React.createElement((): React.ReactElement =>
  {
    return (
      <CashBackLayout assetMoney={800000} />
    );
  }));
;
