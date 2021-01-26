const  jwt = require('jsonwebtoken')
const generateString = require('./generateRandomString')
global.accessTokenMap = new Map()

function generateTokens(guid){
    const  accessToken=jwt.sign({guid:guid}, process.env.SECRET,{algorithm: 'HS512'})
    const sliceOfAT = accessToken.slice(accessToken.length-6,accessToken.length-1)

    let data = generateString(14)+sliceOfAT 
    //adding AccessToken To The map (hash table) of AccessTokens in order to find them leter from refresh token. 

    accessTokenMap.set(sliceOfAT, {AccessToken: accessToken})

    let buffer = new Buffer.from(data)
    const refreshToken =buffer.toString('base64');
    
    return{
        AccessToken: accessToken,
        RefreshToken: refreshToken
    }
}

module.exports = generateTokens;