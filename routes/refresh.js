const bcrypt=require('bcryptjs')
const findingATKey = require('./util/findingKeyForATMap')
const findToken=require('./util/findToken')

async function refreshTokens(req,res) {
    console.log(req.body.RefreshToken)

    const guid = findToken(req.body.RefreshToken);

    const key = findingATKey(req.body.RefreshToken)
    console.log(key)

    if(guid==undefined || key==""){
        res.status(403)
        res.json('Your Refresh token expired or invalid')
    }
    else{
   
        const AccessToken = accessTokenMap.get(key).AccessToken
  
        await res.json({
            AccessToken: AccessToken,
            RefreshToken: 'some refreshToken'
        }) 
    }

}

module.exports = {refreshTokens:refreshTokens};