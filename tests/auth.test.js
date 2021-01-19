const request = require('supertest')
const app = require('../app')
const checkingforGUID=require('../routes/util/checkingForGUID')
const {v4:uuidv4} =require('uuid');

test('checking for GUID',async()=>{
    let guid=''
    expect(checkingforGUID(guid)).toBe(false)
    guid = uuidv4();

    expect(checkingforGUID(guid)).toBe(true)
    //console.log(guid)

    guid = "gggggggg-gggg-gGgG-GgGg-GGGGGGGGGGGG"
    expect(checkingforGUID(guid)).toBe(false)
    //console.log(guid)
})

test('testin auth with valid GUID',async ()=>{

    const response = await request(app).post('/getnewtokens')
    .send({guid:uuidv4()});
    expect(response.body).toBe('Hello, World')
    expect(response.statusCode).toBe(200);
})

