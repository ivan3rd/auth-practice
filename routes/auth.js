const checkingForGUID = require('./util/checkingForGUID')
const generateTokens = require('./util/toGenerateTokens')
const jwt = require('jsonwebtoken')

const middleware =(req,res,next)=>{
    if(checkingForGUID(req.body.guid)){
        next();
    }else{
        res.status(401)
        res.json('Your GUID is invalid')
    }
    res.status(500)
    res.json('Something broke')
}

const authorization = (req,res)=>{
    const tokens = generateTokens(req.body.guid)

    res.json(tokens)
}
 

module.exports = {
    middleware: middleware,
    authorization: authorization
}