import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getEnvironment(): {
  envName: string;
  dbUrl: string;
  sentryAuthToken: string;
} {
  const releaseChannel = Constants.manifest?.releaseChannel;

  console.log('=== releaseChannel:', releaseChannel);
  if (!releaseChannel) {
    // no releaseChannel (is undefined) in dev
    return {
      envName: 'UNKNOW',
      dbUrl:
        Platform.OS === 'android'
          ? 'http://10.0.2.2:4000/graphql'
          : 'http://localhost:4000/graphql',
      sentryAuthToken:
        'b3ffc088948b4ebfaf941ec1878ad1ffbeea164ba7e8430bad29d99443227398',
    }; // dev env settings
  }

  if (releaseChannel.indexOf('prod') !== -1) {
    // matches prod-v1, prod-v2, prod-v3
    return {
      envName: 'PRODUCTION',
      dbUrl: 'https://jangbeecall-dev.azurewebsites.net/graphql',
      sentryAuthToken:
        'b3ffc088948b4ebfaf941ec1878ad1ffbeea164ba7e8430bad29d99443227398',
    }; // prod env settings
  }
  if (releaseChannel.indexOf('beta') !== -1) {
    // matches staging-v1, staging-v2
    return {
      envName: 'BETA',
      dbUrl: 'https://jangbeecall-dev.azurewebsites.net/graphql',
      sentryAuthToken:
        'b3ffc088948b4ebfaf941ec1878ad1ffbeea164ba7e8430bad29d99443227398',
    }; // stage env settings
  }

  return {
    envName: 'DEVELOPMENT',
    dbUrl:
      Platform.OS === 'android'
        ? 'http://10.0.2.2:4000/graphql'
        : 'http://localhost:4000/graphql',
    sentryAuthToken:
      'b3ffc088948b4ebfaf941ec1878ad1ffbeea164ba7e8430bad29d99443227398',
  }; // dev env settings
}
