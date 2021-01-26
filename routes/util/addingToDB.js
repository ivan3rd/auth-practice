const mongoose = require('mongoose')
const Model = require('../forDB/models')

const addingToDB = async (guid,refreshToken)=>{
    
    const tokens = new Model({
        guid:guid,
        RefreshToken:refreshToken
    })
    
    await tokens.save(async(err,tokens)=>{
        if(err) return console.log(err)
        console.log('new instance has been saved')
    })
}

module.exports = addingToDB;