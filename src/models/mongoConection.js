const {MongoClient} = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()

const MONGO_DB_URL = process.env.MONGO_DB_URL
const DB_NAME = process.env.DB_NAME

const connection = () => MongoClient
    .connect(MONGO_DB_URL)
    .then((conn)=>conn.db(DB_NAME))
    .catch((err)=>{
        console.error(err)
        process.exit(1)
    })

    module.exports = connection