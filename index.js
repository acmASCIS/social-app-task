const express = require('express'); 
const app=express();
const mongoose=require('mongoose');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
const route= require("./app");


app.use("/users",route);

app.get("/",(req,res)=>{
    res.send("welcome");
});
/*
app.get("/users",(req,res)=>{
    res.send([{id:"1", name:"nadeen",email:"nadeen@gmail.com",created_at:"2/20"}]
        )});
*/
mongoose.connect("mongodb+srv://nadeen:nadeen123@cluster0.gcqmo.mongodb.net/<dbname>?retryWrites=true&w=majority"
,{useNewUrlParser:true,useUnifiedTopology:true},()=>
console.log("connected!!")
//const c=await.use.find();

);
//console.log(app);


//const port=process.env.port || 5000;



app.listen(5000,()=>console.log("hello world"));