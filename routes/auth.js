const checkingForGUID = require('./util/checkingForGUID')
const generateTokens = require('./util/toGenerateTokens')
const jwt = require('jsonwebtoken')

const middleware =(req,res,next)=>{
    if(checkingForGUID(req.body.guid)){
        next();
    }
    res.status(401)
    res.json('Your GUID is invalid')
}

const authorization = (req,res)=>{
    const tokens = generateTokens(req.body.guid)

    // const accessToken=jwt.sign({guid:req.body.guid}, 'secret',{algorithm: 'HS512'})
    // const refreshToken = jwt.sign({payload:accessToken.slice(accessToken.length-6,accessToken-1)},'secret')
 
    res.json(tokens)
}
 

module.exports = {
    middleware: middleware,
    authorization: authorization
}