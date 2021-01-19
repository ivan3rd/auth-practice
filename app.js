const express = require('express')
const app = express();

//const mongoose = require('mongoose')

require('dotenv').config();

app.use(express.json())

const {middleware,authorization}=require('./routes/auth')

app.post('/getnewtokens',(req,res,next)=>middleware(req,res,next),
    (req,res)=>authorization(req,res)
)

// mongoose.connect(
//     process.env.ATLAS_URI,
//     {
//         useNewUrlParser:true,
//         useCreateIndex:true,
//         useUnifiedTopology: true
//     })
// mongoose.connection.once('open',()=>{
//     console.log('MongoDB connection established')
// })


module.exports = app;
//module.exports = mongoose;