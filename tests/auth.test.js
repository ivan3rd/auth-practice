const request = require('supertest')
const app = require('../app')
const checkingforGUID=require('../routes/util/checkingForGUID')
const jwt = require('jsonwebtoken')
const generateTokens = require('../routes/util/toGenerateTokens')
const {v4:uuidv4} =require('uuid');
    //const ethalon = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi

const secret = 'secret';

expect.extend({
    toBeValidJWT(received, secret){
        const decoded = jwt.verify(received, secret,{algorithm: 'HS512'});

        if(decoded){
            return {
                message:()=> 
                    `this is a valid JWT generated with secret ${secret}`,
                pass: true
            }
        }
        else{
            return{
                message:()=> 
                    `this is a INvalid JWT`,
                pass: false
            } 
        }
    }
})

expect.extend({
    toBeValidbase64(received,accessToken){
        const findOriginalRefreshToken = (AT)=>{
            return 'randomSymbols'+AT.slice(AT.length-6, AT.length-1)
         }
        const originalString= findOriginalRefreshToken(accessToken)

        const buff = new Buffer.from(received,'base64')
        const decoded =  buff.toString('ascii')

        if(decoded==originalString){
            return{
                message:()=>`${received} has been turned in ${decoded}`,
                pass: true
            }
        }
        else{
            return{
                message:()=>`${received} has been turned in ${decoded}`,
                pass: false
            }
        }  
    }
})


test('checking for GUID',async()=>{
    let guid=''
    expect(checkingforGUID(guid)).toBe(false)
    guid = uuidv4();

    expect(checkingforGUID(guid)).toBe(true)

    guid = "gggggggg-gggg-gGgG-GgGg-GGGGGGGGGGGG"
    expect(checkingforGUID(guid)).toBe(false)

})

test('checking for apropriete generation of tokens',async()=>{
    
    const tokens = generateTokens(uuidv4())
    console.log(tokens)
    expect(tokens).toMatchObject({
        AccessToken: expect.toBeValidJWT(secret),
        RefreshToken: expect.toBeValidbase64(tokens.AccessToken)
    })
})


test('testing auth with INvalid GUID',async ()=>{

    const response = await request(app).post('/getnewtokens')
    .send({guid:"gggggggg-gggg-gGgG-GgGg-GGGGGGGGGGGG"});
    expect(response.body).toBe('Your GUID is invalid')
    expect(response.statusCode).toBe(401);
})




test('testing auth with valid GUID',async ()=>{

    const response = await request(app).post('/getnewtokens')
    .send({guid:uuidv4()});

    expect(response.body).toMatchObject({
        AccessToken: expect.toBeValidJWT(secret),
        RefreshToken: expect.toBeValidbase64(response.body.AccessToken)
    })

    expect(response.statusCode).toBe(200);
})