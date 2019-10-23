function connect(callback){

    const MongoClient = require("mongodb").MongoClient;
    const url = "mongodb://localhost:27017";
    const client = new MongoClient(url, {useNewUrlParser: true });
  
    client.connect(errClient=>{
      if(errClient!==null) 
        console.log("Error while connecting to mongodb: ", errClient);  
      
      const db = client.db("dbUsers");
  
      const collection = db.collection("users");
  
      callback(client, collection);
  
    });
  }

  function getUser(callback,nombre){
    connect( (client, collection) =>{
      collection.find({username:nombre}).toArray(function(errDatabase, docs) {
        if(errDatabase!==null)
          console.log("Error while getting the collection", errDatabase);
        callback(docs);
       client.close();
      });
    });
  }

  module.exports = getUser,connect; 