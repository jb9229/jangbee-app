const loadingStorybook = true;
export default (loadingStorybook
  ? require('./storybook').default
  : require('src/index').default);
