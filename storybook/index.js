import './rn-addons';

import { configure, getStorybookUI } from '@storybook/react-native';

import { AppRegistry } from 'react-native';
import { loadAllAssests } from 'src';
import { loadStories } from './storyLoader';
import { setupGlobalDecorators } from './global_decorators';

Promise.all(loadAllAssests).then(() => {
  console.log('Storybook LoadResourcesAsync done'); // this is quick enough that it works.
});

/**
 * 전역 데코레이터 추가 설정
 */
setupGlobalDecorators();

// Stories Dinamic Importing
configure(() => {
  loadStories();
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
// AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
