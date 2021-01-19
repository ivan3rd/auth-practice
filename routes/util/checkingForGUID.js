const checkingForGUID=(guid)=>{
    const ethalon = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi
    if(guid.match(ethalon)){   
        return true;
    } 
    return false
}

module.exports = checkingForGUID