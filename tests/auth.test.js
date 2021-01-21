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
        console.log(tokens)
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


describe('testing with connection to the app',()=>{

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
})

const {MongoClient} = require('mongodb');

describe('test for database',()=>{
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect("mongodb://127.0.0.1:3500/jestdb?", {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        db = await connection.db();
      });
    
    afterAll(async () => {
        await db.collection('users').deleteMany({});
        await connection.close();
      });

    test.only('should insert a doc into collection', async () => {
        const users = db.collection('users');

        const mockUser = {_id: 'some-user-id', name: 'John'};
        await users.insertOne(mockUser);
      
        const insertedUser = await users.findOne({_id: 'some-user-id'});
        expect(insertedUser).toEqual(mockUser);
      });
})