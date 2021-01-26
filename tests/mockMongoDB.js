const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer({
    instance:{
        port:3500,
        ip:'127.0.0.1',
        dbName:'jestdb'
    }
});

const server = async ()=>{
    const uri = await mongod.getUri();
    const port = await mongod.getPort();
    const dbPath = await mongod.getDbPath();
    const dbName = await mongod.getDbName();

    console.log(`uri = ${uri}`)
    console.log(`port is = ${port}`)
    console.log(`dbPath is = ${dbPath}`)
    console.log(`process.env.MONGO_URL is ${process.env.MONGO_URL}`)

    console.log('mockServerHasBeenStarted')
    
}

server();