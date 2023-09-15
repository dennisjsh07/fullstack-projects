const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = (callback)=>{
  MongoClient.connect('mongodb+srv://dennisjshofficial:wO22Kgq8wN5XBCGv@dennisjsh.q5qgsgx.mongodb.net/shop?retryWrites=true')
  .then((client)=>{
    console.log('connected');
    db = client.db() // you can overwrite the database here by passing inside the callback.
    callback();
  })
  .catch((err)=>{
    console.log(err);
    throw err;
  })
}

const getDb = ()=>{
  if(db){
    return db;
  }
  throw 'no datbase found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
