
const findingKeyForATMap =(RT)=>{

    const buff = new Buffer.from(RT,'base64')
    let decoded =  buff.toString('ascii')

    decoded = decoded.slice(decoded.length-5)

    return decoded
}

module.exports = findingKeyForATMap;
