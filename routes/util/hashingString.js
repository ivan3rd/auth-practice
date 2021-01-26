const bcrypt = require('bcryptjs')

const hashingString=(givenString)=>{

    let hashedString = bcrypt.hashSync(givenString,10)

    return hashedString
}


module.exports=hashingString;