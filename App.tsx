// import * as React from 'react';

// import LoadingIndicator from 'molecules/LoadingIndicator';
// import { loadAllAssests } from 'src';

const loadingStorybook = false;
export default (loadingStorybook
  ? require('./storybook').default
  : require('src/index').default);

// const App = () =>
// {
//   const [loaded, setLoaded] = React.useState(false);
//   React.useEffect(() =>
//   {
//     Promise.all(loadAllAssests).then(() =>
//     {
//       console.log('Storybook LoadResourcesAsync done'); // this is quick enough that it works.
//       setLoaded(true);
//     }).catch((err) => { console.log(err) });
//   }, []);

//   if (loaded)
//   {
//     return require('./storybook').default;
//   }
//   else
//   {
//     return require('src/index').default;
//   }
// };

// export default App;

// import * as Font from 'expo-font';

// import { Image, Text, View } from 'react-native';

// import { AppLoading } from 'expo';
// import { Asset } from 'expo-asset';
// import React from 'react';

// export default class App extends React.Component
// {
//   state = {
//     isReady: false
//   };

//   render ()
//   {
//     if (!this.state.isReady)
//     {
//       return (
//         <AppLoading
//           startAsync={this._cacheResourcesAsync}
//           onFinish={() => this.setState({ isReady: true })}
//           onError={console.warn}
//         />
//       );
//     }

//     return require('./storybook').default;
//   }

//   async _cacheResourcesAsync ()
//   {
//     // const images = [require('./assets/snack-icon.png')];

//     // const cacheImages = images.map(image =>
//     // {
//     //   return Asset.fromModule(image).downloadAsync();
//     // });
//     return Promise.all(loadAllAssests);
//   }
// }

// export const loadAllAssests = [
//   // Asset.loadAsync([
//   //   require('../assets/images/robot-dev.png'),
//   //   require('../assets/images/robot-prod.png')
//   // ]),
//   Font.loadAsync({
//     // This is the font that we are using for our tab bar
//     // ...Icon.Ionicons.font,
//     // We include SpaceMono because we use it in HomeScreen.js. Feel free
//     // to remove this if you are not using it in your app
//     SsangmundongGulimB: require('./assets/fonts/Typo_SsangmundongGulimB.ttf'),
//     NanumSquareRoundR: require('./assets/fonts/NanumSquareRoundR.ttf'),
//     NanumGothic: require('./assets/fonts/NanumGothic.ttf'),
//     NanumPen: require('./assets/fonts/NanumPen.ttf')
//   })
// ];
