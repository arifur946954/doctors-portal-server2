const express=require('express');
const app=express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors');
app.use(express.json());
require('dotenv').config();
const port=process.env.PORT || 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pfe3z4d.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://DoctorPortal:r1G2trY8CuCV9bDe@cluster0.pfe3z4d.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
await client.connect();
const appoinmentOptionCollection=client.db("Doctors-Portal2").collection("appoinmentOption2");
//get data from db
app.get('/appoinmentOption2',async(req,res)=>{
const query={};
const cursor=appoinmentOptionCollection.find(query);
const user=await cursor.toArray();
res.send(user);
})
    }
    finally{

    }
}
run().catch(console.dir);









app.get('/',(req,res)=>{
    res.send("running my operation");
});

app.listen(port,()=>{
    console.log("crud is running");
})
