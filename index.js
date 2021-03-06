const app = require('./app.js')
const port =process.env.PORT || 5000;
const mongoose = require('mongoose')

mongoose.connect(
    MONGO_URI, 
    {useNewUrlParser: true, 
    useUnifiedTopology: true})

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open',()=>{
        console.log('Connection established')   
    })
    

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

