// AB - react-native-dotenv added since react-native does not support dotenv

module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
    };
  };
