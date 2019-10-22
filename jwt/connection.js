function connect(callback){

    const MongoClient = require("mongodb").MongoClient;
    const url = "mongodb+srv://Enguenye2:123@cluster0-guh6h.mongodb.net/test?retryWrites=true&w=majority";
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
      collection.find({nombre:nombre}).toArray(function(errDatabase, docs) {
          console.log(docs);
        if(errDatabase!==null)
          console.log("Error while getting the collection", errDatabase);
        callback(docs);
       
      });
    });
  }

  module.exports = getUser,connect; 