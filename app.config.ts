import 'dotenv/config';

import { loadingStorybook } from './App';

export default ({ config }): any =>
{
  return {
    ...config,
    extra: {
      buildType: process.env.BUILD_TYPE
    },
    version: process.env.MY_CUSTOM_PROJECT_VERSION || '0.0.0',
    slug: loadingStorybook ? 'jangbeecall_story' : process.env.BUILD_TYPE === 'dev' ? `${config.slug}_dev`
      : process.env.BUILD_TYPE === 'beta' ? `${config.slug}_beta` : config.slug,
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
    },
    // All values in extra will be passed to your app.
    extra: {
      fact: 'kittens are cool'
    }
  };
};
