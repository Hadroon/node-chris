const Config = {};

Config.all = {
  port: process.env.PORT || 8899,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb'
};



module.exports = Config;
