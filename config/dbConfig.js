const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Conexiunea la MongoDB a reusit');
})

connection.on('error', (error) => {
    console.log('Nu a reusit conexiunea la MongoDB', error);
})

module.exports = mongoose;