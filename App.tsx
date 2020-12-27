export const loadingStorybook = false;
export default loadingStorybook
  ? require('./storybook').default
  : require('src/index').default;
/**
 * package.json 하기 내용 제거 firebease 배포 이슈
 * "homepage": "https://jb9229.github.io/jangbee-app/",
 **/
