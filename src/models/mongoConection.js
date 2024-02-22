const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()

const MONGO_DB_URL = process.env.MONGO_DB_URL
const DB_NAME = process.env.DB_NAME

mongoose.connect(MONGO_DB_URL+DB_NAME)
    .then(() => console.log('Conexão com MongoDB realizada'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

module.exports = mongoose.connection;