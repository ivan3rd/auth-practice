const express = require('express')
const app = express();

require('dotenv').config();

app.use(express.json())

const {middleware,authorization}=require('./routes/auth')
const {refreshTokens} = require('./routes/refresh')

app.post('/getnewtokens',(req,res,next)=>middleware(req,res,next),
    (req,res)=>authorization(req,res)
)
app.post('/refreshtokens',(req,res)=>{
    refreshTokens(req,res)
}
)


module.exports = app;
