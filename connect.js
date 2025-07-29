const mongoose = require('mongoose');
mongoose.set('strictQuery',true);

async function connectToMongo(url) {
  return mongoose.connect(url);
  
}

module.exports = {
  connectToMongo,
}