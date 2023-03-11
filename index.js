const express=require('express');
const app=express();
const cors=require('cors');
app.use(express.json());
require('dotenv').config();
const port=process.env.PORT || 5000;



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pfe3z4d.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://DoctorPortal:r1G2trY8CuCV9bDe@cluster0.pfe3z4d.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});










app.get('/',(req,res)=>{
    res.send("running my operation");
});

app.listen(port,()=>{
    console.log("crud is running");
})
