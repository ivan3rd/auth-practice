const request = require('supertest')
const app = require('../app')
const checkingforGUID=require('../routes/util/checkingForGUID')
const {v4:uuidv4} =require('uuid');

test('checking for GUID',async()=>{
    let guid
    expect(checkingforGUID(guid)).toBe("You don't have a GUID")
    guid = uuidv4();
    expect(checkingforGUID(guid)).toBe(`Your GUID is ${guid}`)
    console.log(guid)
})

test('dose GET / work?',async ()=>{
    const response = await request(app).post('/getnewtokens');
    expect(response.body).toBe('Hello, World')
    expect(response.statusCode).toBe(200);
})