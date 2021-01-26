const { response } = require('express');
const Model = require('../forDB/models')
const bcrypt = require('bcryptjs')

async function findToken (RefreshToken){

    const findTokens = await Model.find({},'guid RefreshToken').exec();
    const foundTokens = await findTokens;
    let guid;
    foundTokens.forEach((item,index,array)=>{
        let bull = bcrypt.compareSync(RefreshToken, item.RefreshToken)
        if(bull){
            guid =item.guid
        }
    })

    return guid
}

module.exports= findToken;