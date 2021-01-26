
const findingKeyForATMap =(RT)=>{

    const buff = new Buffer.from(RT,'base64')
    let decoded =  buff.toString('ascii')

    decoded = decoded.slice(process.env.RANDOM_SYMBOLS.length)

    return decoded
}

module.exports = findingKeyForATMap;
