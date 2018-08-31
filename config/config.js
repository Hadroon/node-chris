const Config = {};

Config.all = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb',
  sessionSecret: process.env.SESSION_SECRET || 'ilovescotchscotchyscotchscotch',
  googleAuth: {
    'clientID'      : '67148300550-i59u3tj3g77c5gv5j85ra1um72ss6uen.apps.googleusercontent.com',
    'clientSecret'  : 'SUB4j7-vYxE0gCvZeDjK4izF',
    'callbackURL'   : process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8080/auth/google/callback'
  }
};

module.exports = Config;
