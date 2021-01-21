const app = require('./app.js')
const port =process.env.PORT || 5000;
const mongoose = require('mongoose')

mongoose.connect(
    process.env.ATLAS_URI,
    {
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology: true
    })
mongoose.connection.once('open',()=>{
    console.log('MongoDB connection established')
})


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

