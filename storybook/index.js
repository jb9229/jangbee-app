import './rn-addons';

import { configure, getStorybookUI } from '@storybook/react-native';

import firebase from 'firebase';
import firebaseconfig from '../firebaseconfig';
import { loadAllAssests } from 'src';
import { loadStories } from './storyLoader';
import { setupGlobalDecorators } from './global_decorators';

Promise.all(loadAllAssests).then(() =>
{
  console.log('Storybook LoadResourcesAsync done'); // this is quick enough that it works.
}).catch((err) => { console.log(err) });
// // Stories Dinamic Importing
// configure(() =>
// {
//   initFirebase();
//   loadStories();
// }, module);

/**
 * 전역 데코레이터 추가 설정
 */
// function wait (msecs)
// {
//   const start = new Date().getTime();
//   let cur = start;

//   while (cur - start < msecs)
//   {
//     cur = new Date().getTime();
//   }
// }

// wait(1000);
setupGlobalDecorators();

const initFirebase = () =>
{
  if (!firebase.apps.length)
  {
    firebase.initializeApp(firebaseconfig);
  }

  firebase.auth().languageCode = 'ko';
};

// async () =>
// {
//   await Promise.all(loadAllAssests).then(() =>
//   {
//     console.log('Storybook LoadResourcesAsync done'); // this is quick enough that it works.
//   }).catch((err) => { console.log(err) });
// };

// Stories Dinamic Importing
configure(() =>
{
  console.log('end loadAllAssets');
  initFirebase();
  loadStories();
}, module);
console.log('start root ui');
// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
// AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
