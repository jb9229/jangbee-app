import * as React from 'react';

import { CallLog } from 'container/calllog/types';
import CallLogLayout from 'container/calllog/CallLogLayout';
import { storiesOf } from '@storybook/react-native';

storiesOf('콜로그', module).add('레이아웃', () =>
  React.createElement(
    (): React.ReactElement => {
      const storyCallLogs: CallLog[] = [
        { callerPhoneNumber: '01052023337', callTime: new Date().getTime() },
      ];
      return <CallLogLayout logs={storyCallLogs} />;
    }
  )
);
