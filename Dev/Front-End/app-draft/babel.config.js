// AB - react-native-dotenv added since react-native does not support dotenv

module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        ['module:react-native-dotenv', {
          moduleName: '@env',
          path: '.env',
          allowUndefined: true,
        }],
      ],
    };
  };