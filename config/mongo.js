const mongoose = require('mongoose');
const connectingDB = async () => {
  try {
    mongoose.set('strictQuery', false); 
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectingDB;
