const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    guid: String,
    RefreshToken:String
})

const Tokens = mongoose.model('Tokens',schema)

module.exports = Tokens;