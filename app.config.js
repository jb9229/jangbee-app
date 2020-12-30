import 'dotenv/config';

import { loadingStorybook } from './App';

export default ({ config }) => {
  console.log('>>> SLUG config: ', process.env.BUILD_TYPE);
  return {
    ...config,
    extra: {
      buildType: process.env.BUILD_TYPE,
    },
    slug: loadingStorybook
      ? 'jangbeecall_story'
      : process.env.BUILD_TYPE === 'dev'
      ? 'jangbeecall_dev'
      : process.env.BUILD_TYPE === 'beta'
      ? 'jangbeecall_beta'
      : config.slug,
    icon: loadingStorybook ? './assets/images/storyIcon_32.png' : config.icon,
    hooks: {
      ...config.hooks,
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'kan',
            project: 'jangbeecall',
            authToken: process.env.SENTRY_AUTHTOKEN,
          },
        },
      ],
    },
    android: {
      ...config.android,
      config: {
        googleSignIn: {
          apiKey: process.env.GOOGLE_APIKEY,
        },
      },
    },
  };
};
