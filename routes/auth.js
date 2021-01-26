const checkingForGUID = require('./util/checkingForGUID')
const generateTokens = require('./util/toGenerateTokens')
const addingTODB = require('./util/addingToDB')
const hashingString = require('./util/hashingString')


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

const authorization =  (req,res)=>{
    const tokens = generateTokens(req.body.guid)

    const hashedRT = hashingString(tokens.RefreshToken)

    addingTODB(req.body.guid,hashedRT);

    res.json(tokens)
}
 

module.exports = {
    middleware: middleware,
    authorization: authorization
}