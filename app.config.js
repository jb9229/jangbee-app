import 'dotenv/config';

import { loadingStorybook } from './App';

export default ({ config }) => {
  return {
    ...config,
    slug: loadingStorybook ? 'jangbeecall_story' : config.slug,
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
