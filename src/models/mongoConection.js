const {MongoClient} = require('mongodb')

const MONGO_DB_URL = 'mongodb://localhost:27017'
const DB_NAME = 'aulas'

const connection = () => MongoClient
    .connect(MONGO_DB_URL)
    .then((conn)=>conn.db(DB_NAME))
    .catch((err)=>{
        console.error(err)
        process.exit(1)
    })

    module.exports = connection