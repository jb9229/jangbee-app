module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^atoms/(.*)$': '<rootDir>/src/components/atoms/$1',
    '^molecules/(.*)$': '<rootDir>/src/components/molecules/$1',
    '^organisms/(.*)$': '<rootDir>/src/components/organisms/$1',
    '^container/(.*)$': '<rootDir>/src/container/$1',
    '^constants/(.*)$': '<rootDir>/src/constants/$1',
    '^templates/(.*)$': '<rootDir>/src/components/templates/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^assets/(.*)$': '<rootDir>/assets/$1'
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: {
        jsx: 'react'
      }
    }
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/.history/'
  ],
  transformIgnorePatterns: [
    // 'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base)'
    'node_modules/(?!(jest-)?react-native|unimodules-permissions-interface|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base)'
  ],
  timers: 'fake' // [Animation Timer Issue] https://github.com/facebook/jest/issues/6434
};
