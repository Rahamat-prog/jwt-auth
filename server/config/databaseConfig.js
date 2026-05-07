const mongoose = require('mongoose');
const MONGO_URL = "mongodb://localhost:27017/mydb" || process.env.MONGO_URL;

const databaseConnected = () => {
    mongoose.connect(MONGO_URL)
    .then((conn) => console.log(`connected to db ${conn.connection.host}`))
    .catch((error) => console.log(error.message));
}

module.exports = databaseConnected;