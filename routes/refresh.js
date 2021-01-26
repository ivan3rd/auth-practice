const bcrypt=require('bcryptjs')
const findingATKey = require('./util/findingKeyForATMap')
const findToken=require('./util/findToken')
const generateTokens = require('./util/toGenerateTokens')
const Model = require('./forDB/models')
const hashingString = require('./util/hashingString')

let guid;
let key;
async function checkingForRefreshTokens(req,res,next){

    guid = await findToken(req.body.RefreshToken)
    key = findingATKey(req.body.RefreshToken)

    //checking if refreshToken exists in data base and also as
    if(guid ==undefined || key==""){
        res.status(403)
        res.json('Your Refresh token expired or invalid')
    }
    else{
        if(!accessTokenMap.has(key)){
            res.status(403)
            res.json('Your Refresh token has expired')
        }else{
            next()
        }
        
    }
}


async function refreshingTokens(req,res) {



    const tokens = generateTokens(guid)

    const hashedRT = hashingString(tokens.RefreshToken)

    const findModel = Model.updateOne({guid:guid}, {RefreshToken:hashedRT}).exec();

    await res.json({
        AccessToken: tokens.AccessToken,
        RefreshToken: tokens.RefreshToken
    }) 

}

module.exports = {
    checkingForRefreshTokens:checkingForRefreshTokens,
    refreshingTokens:refreshingTokens};