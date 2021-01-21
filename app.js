const express = require('express')
const app = express();
const mongoose = require('mongoose')

mongoose.connect(
    "mongodb://127.0.0.1:3500/jestdb?",
    {
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology: true
    })
mongoose.connection.once('open',()=>{
    console.log('MongoDB connection established')
})

require('dotenv').config();

app.use(express.json())

const {middleware,authorization}=require('./routes/auth')

app.post('/getnewtokens',(req,res,next)=>middleware(req,res,next),
    (req,res)=>authorization(req,res)
)



module.exports = app;
