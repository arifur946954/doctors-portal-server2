const express=require('express');
const app=express();
const jwt=require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
const { query } = require('express');
app.use(cors());
app.use(express.json());
require('dotenv').config();
const port=process.env.PORT || 5000;
 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pfe3z4d.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://DoctorPortal:r1G2trY8CuCV9bDe@cluster0.pfe3z4d.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req,res,next){
console.log("tocken verifyed",req.headers.authorization);
const authHeader=req.headers.authorization;
if(!authHeader){
    return res.send(401).send("unautherised access");
}
const token=authHeader.split(' ')[1]; 
}



async function run(){
    try{
await client.connect();
const appoinmentOptionCollection=client.db("Doctors-Portal2").collection("appoinmentOption2");
const bookingsCollection=client.db("Doctors-Portal2").collection("bookings");
const usersCollection=client.db("Doctors-Portal2").collection("users");
//user is test case so no need to accept it 
const addUser=client.db("Doctors-Portal2").collection("user");
//get data from db
app.get('/appoinmentOption2',async(req,res)=>{
    const date=req.query.date; 
    // console.log(date);
const query={};
const options=await appoinmentOptionCollection.find(query).toArray();
//get the booking of the provider date
const bookingQuery={appoinmentDate:date};
const allreadyBooked=await bookingsCollection.find(bookingQuery).toArray();
options.forEach(option=>{
    const optionBooked=allreadyBooked.filter(book=>book.Tname===option.name);
    const bookSloted=optionBooked.map(books=>
        books.slot
      );
      const remainingSlot=option.slots.filter(slot=>!bookSloted.includes(slot));
      option.slots=remainingSlot;
    // console.log(date,option.name ,remainingSlot.length);

   
  
})


// const user=await  options.toArray();
res.send(options);

})
//get bookings data from database
app.get('/bookings',verifyJWT,async(req,res)=>{
    const email=req.query.email;
//    console.log(req.headers.authorization);
    // console.log(email);
    const query={email:email}
    const booking=await bookingsCollection.find(query).toArray();
    res.send(booking);
})


//post data from the user
app.post('/users',async(req,res)=>{
    const users=req.body;
    const result =await usersCollection.insertOne(users);
    res.send(result);
})

//get data from jwt
//important note get data from database and show data inside get url.this url made by me what i want
app.get('/jwt',async(req,res)=>{
    const email=req.query.email;
   const  query={email:email}
    const user =await usersCollection.findOne(query);
    if(user){
        const token=jwt.sign({email},process.env.ACCESS_TOCKEN, { expiresIn:'1h' })
        return  res.send({accessToken:token})
    }
    console.log(user);
    res.status(404).send({accessToken:" token is unavailable"});


})

//post data from user this is test case
app.post('/bookings',async(req,res)=>{

    const bookingss=req.body;
   
     console.log(bookingss);
   
    const query={
        appoinmentDate:bookingss.appoinmentDate,
        Tname:bookingss.Tname,
        email:bookingss.email
    }
    const allreadyBooked=await bookingsCollection.find(query).toArray();
    if(allreadyBooked.length){
        const message=`you allready have a booked ${bookingss.appoinmentDate}`
        return res.send({acknowledged:false,message})
    }
    const result=await bookingsCollection.insertOne(bookingss);
     res.send(result)
    // console.log(result);

})

//user data post
app.post('/user',async(req,res)=>{
    const useData=await req.body;
     //console.log(useData);
     const result=await addUser.insertOne(useData);
     res.send(result)
    // console.log(result);
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
