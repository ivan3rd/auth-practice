const hashingString = require("./util/hashingString");
const Model = require('./forDB/models')
const bcrypt=require('bcryptjs')

async function refreshTokens(req,res) {

    const HashedRT = hashingString(req.body.RefreshToken)

    const findTokens = Model.find({},'guid RefreshToken').exec();
    const foundTokens = await findTokens;

    let guid

    foundTokens.forEach((item,index,array)=>{
        let bull = bcrypt.compareSync(req.body.RefreshToken, item.RefreshToken)
        if(bull){
            guid = item.guid
        }
    })
    
    //await console.log(findTokens)

    await res.json({
        guid:guid,
        HashedRT: HashedRT
    }) 
}

module.exports = {refreshTokens:refreshTokens};