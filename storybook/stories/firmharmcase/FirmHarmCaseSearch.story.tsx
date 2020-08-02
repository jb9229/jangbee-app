import * as React from 'react';

import { boolean, text } from '@storybook/addon-knobs';

import FirmHarmCaseSearchLayout from 'src/components/templates/FirmHarmCaseSearchLayout';
import FirmHarmCaseSearchSBProvider from 'storybook/provider/FirmHarmCaseSearchSBProvider';
import { SafeAreaView } from 'react-native';
import { SafeZonDecorator } from 'storybook/stories/ad/Ad.story';
import { storiesOf } from '@storybook/react-native';

// storiesOf('피해사례', module)
//   .addDecorator(SafeZonDecorator)
//   .add('조회', () => React.createElement((): React.ReactElement =>
//   {
//     return (
//       <FirmHarmCaseSearchSBProvider>
//         <FirmHarmCaseSearchLayout/>
//       </FirmHarmCaseSearchSBProvider>
//     );
//   }));
// ;