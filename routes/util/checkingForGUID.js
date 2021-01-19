const checkingForGUID=(guid)=>{
    if(guid){
        return `Your GUID is ${guid}`;
    } 
    return "You don't have a GUID"
}

module.exports = checkingForGUID