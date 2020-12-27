import * as React from 'react';

import { CallLog } from 'container/calllog/types';
import CallLogLayout from 'container/calllog/CallLogLayout';
import moment from 'moment';
import { storiesOf } from '@storybook/react-native';

storiesOf('콜로그', module).add('레이아웃', () =>
  React.createElement(
    (): React.ReactElement => {
      const storyCallLogs: CallLog[] = [
        { callerPhoneNumber: '01052023337', timestamp: new Date().getTime() },
        {
          callerPhoneNumber: '0101111111',
          timestamp: moment().add(-1, 'months').valueOf(),
        },
        {
          callerPhoneNumber: '0102222222',
          timestamp: moment().add(-1, 'months').add(-10, 'days').valueOf(),
        },
        {
          callerPhoneNumber: '0103333333',
          timestamp: moment().add(-2, 'months').valueOf(),
        },
      ];
      return <CallLogLayout logs={storyCallLogs} />;
    }
  )
);
