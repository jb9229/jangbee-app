const loadingStorybook = false;
export default (loadingStorybook
  ? require('./storybook').default
  : require('src/index').default);
