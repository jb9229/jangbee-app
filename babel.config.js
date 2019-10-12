module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'babel-plugin-styled-components',
      [
        'module-resolver',
        {
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx',
            '.story.js'
          ],
          root: ['./'],
          alias: {
            navigation: './src/navigation',
            contexts: './src/contexts',
            constants: './src/constants',
            common: './src/common',
            screens: './src/screens',
            auth: './src/auth',
            api: './src/api',
            utils: './src/utils',
            native_modules: './src/native_modules',
            atoms: './src/components/atoms',
            molecules: './src/components/molecules',
            organisms: './src/components/organisms',
            templates: './src/components/templates'
          }
        }
      ]
    ]
  };
};
