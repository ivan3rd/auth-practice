const checkingForGUID = require('./util/checkingForGUID')

const middleware =(req,res,next)=>{
    console.log(`guid = ${req.body.guid}`)
    if(checkingForGUID(req.body.guid)){
        next();
    }

}

const authorization = (req,res)=>{
    res.json('Hello, World')
}


module.exports = {
    middleware: middleware,
    authorization: authorization
}