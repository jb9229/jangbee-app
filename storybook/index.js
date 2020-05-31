import './rn-addons';

import * as Updates from 'expo-updates';

/* global __DEV__ */
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

setupGlobalDecorators();

const initFirebase = () =>
{
  if (!firebase.apps.length)
  {
    firebase.initializeApp(firebaseconfig);
    firebase.auth().languageCode = 'ko';

    console.log('firebase.initialized'); // this is quick enough that it works.
  }
};

const checkUpdate = async () =>
{
  if (!__DEV__)
  {
    try
    {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable)
      {
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        Updates.reloadAsync();
      }
    }
    catch (e)
    {
      console.error(e);
    }
  }
};

// Stories Dinamic Importing
configure(() =>
{
  console.log('end loadAllAssets');
  initFirebase();
  loadStories();
  checkUpdate();
}, module);
console.log('start root ui');
// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
// AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
