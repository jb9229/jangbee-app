import 'dotenv/config';

import { loadingStorybook } from './App';

export default ({ config }) =>
{
  console.log('>>> SLUG config: ', process.env.BUILD_TYPE);
  console.log('>>> MY_CUSTOM_PROJECT_VERSION: ', process.env.MY_CUSTOM_PROJECT_VERSION);
  return {
    ...config,
    extra: {
      buildType: process.env.BUILD_TYPE
    },
    version: process.env.MY_CUSTOM_PROJECT_VERSION || '0.0.0',
    slug: loadingStorybook ? 'jangbeecall_story' : process.env.BUILD_TYPE === 'dev' ? 'jangbeecall_dev'
      : process.env.BUILD_TYPE === 'beta' ? 'jangbeecall_beta' : config.slug,
    icon: loadingStorybook ? './assets/images/storyIcon_32.png' : config.icon,
    hooks: {
      ...config.hooks,
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'Kan',
            project: 'jangbeecall',
            authToken: process.env.SENTRY_AUTHTOKEN
          }
        }
      ]
    }
  };
};
