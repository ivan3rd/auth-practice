const request = require('supertest')
const app = require('../app')
require('dotenv').config();
const checkingforGUID=require('../routes/util/checkingForGUID')
const jwt = require('jsonwebtoken')
const generateTokens = require('../routes/util/toGenerateTokens')
const bcrypt=require('bcryptjs')
const hashingString = require('../routes/util/hashingString')
const {v4:uuidv4} =require('uuid');
    //const ethalon = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi

const secret = process.env.SECRET;

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
            return process.env.RANDOM_SYMBOLS+AT.slice(AT.length-6, AT.length-1)
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

describe('testing utility functions',()=>{



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
        
        expect(tokens).toMatchObject({
            AccessToken: expect.toBeValidJWT(secret),
            RefreshToken: expect.toBeValidbase64(tokens.AccessToken)
        })
    })
    
    test('testing hashing of a given string (Refresh token)',()=>{
    
        const hashString = hashingString('hello, world')
        const bull = bcrypt.compareSync('hello, world',hashString)
        expect(bull).toBe(true)
    })
})

const mongoose = require('mongoose')
const Model = require('../routes/forDB/models')

describe('testing with connection to the app', ()=>{
    let db;

    beforeAll(async ()=>{
        await mongoose.connect('mongodb://127.0.0.1:3500/jestdb?', 
        {useNewUrlParser: true, 
        useUnifiedTopology: true});
        
        db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open',()=>{
            console.log('Connection established')
        })
    })

    afterAll(async()=>{
        await Model.deleteMany({})

        await mongoose.connection.close()
    })


 test('testing auth with INvalid GUID',async ()=>{

    const response = await request(app).post('/getnewtokens')
    .send({guid:"gggggggg-gggg-gGgG-GgGg-GGGGGGGGGGGG"});
    expect(response.body).toBe('Your GUID is invalid')
    expect(response.statusCode).toBe(401);
})

const guid = uuidv4();
let response;
test('testing auth with valid GUID', async()=>{

    response = await request(app).post('/getnewtokens')
    .send({guid:guid});

    //database checking
    const findModel = Model.findOne({guid:guid}, 'guid RefreshToken').exec();

    const foundedModel = await findModel
    console.log(foundedModel)
    // console.log(response.body)
    expect(foundedModel.guid).toBe(guid)
    

    const bull = bcrypt.compareSync(response.body.RefreshToken, foundedModel.RefreshToken)
    // expect(foundedModel.RefreshToken).toBe(response.body.RefreshToken)
    expect(bull).toBe(true)


    //response checking
    expect(response.body).toMatchObject({
        AccessToken: expect.toBeValidJWT(secret),
        RefreshToken: expect.toBeValidbase64(response.body.AccessToken)
    })

    expect(response.statusCode).toBe(200);
})

    test('checking Refresh with recieved Refresh token',async ()=>{
        const RefreshToken = response.body.RefreshToken
  
        const refresh = await request(app).post('/refreshtokens')
        .send({RefreshToken});
        
        

        const bull = await bcrypt.compareSync(RefreshToken, refresh.body.HashedRT)
        
        expect(bull).toBe(true)

        expect(refresh.statusCode).toBe(200)
        expect(refresh.body.guid).toBe(guid)
        expect(refresh.body.AccessToken).toBe(response.body.AccessToken)

    })
})