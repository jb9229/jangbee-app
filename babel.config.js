module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      ['inline-dotenv'],
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
            '.story.tsx',
          ],
          root: ['./'],
          alias: {
            src: './src',
            navigation: './src/navigation',
            constants: './src/constants',
            types: './src/types',
            common: './src/common',
            screens: './src/screens',
            auth: './src/auth',
            api: './src/api',
            utils: './src/utils',
            atoms: './src/components/atoms',
            molecules: './src/components/molecules',
            organisms: './src/components/organisms',
            templates: './src/components/templates',
            container: './src/container',
            native_modules: './src/native_modules',
          },
        },
      ],
    ],
  };
};
