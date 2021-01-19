const checkingForGUID = require('./util/checkingForGUID')

const middleware =(req,res,next)=>{
    console.log('this is middleware')
    next();
}

const authorization = (req,res)=>{
    res.json('Hello, World')
}


module.exports = {
    middleware: middleware,
    authorization: authorization
}