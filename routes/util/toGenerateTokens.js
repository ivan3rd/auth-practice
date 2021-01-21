const  jwt = require('jsonwebtoken')

function generateTokens(guid){
    const  accessToken=jwt.sign({guid:guid}, process.env.SECRET,{algorithm: 'HS512'})
    let data = process.env.RANDOM_SYMBOLS+accessToken.slice(accessToken.length-6,accessToken.length-1)

    let buffer = new Buffer.from(data)
    const refreshToken =buffer.toString('base64');
    
    return{
        AccessToken: accessToken,
        RefreshToken: refreshToken
    }
}

module.exports = generateTokens;