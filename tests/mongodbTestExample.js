const mongoose = require('mongoose')
describe('test for database',async ()=>{

    let db;
    const schema = new mongoose.Schema({
        name: String
    })
    const Model = mongoose.model('Kitten',schema)

    await beforeAll(async () => {
        mongoose.connect('mongodb://127.0.0.1:3500/jestdb?', 
        {useNewUrlParser: true, 
        useUnifiedTopology: true});

        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open',()=>{
            console.log('Connection established')
        })

      });
    
    await afterAll(async () => {
        Model.deleteMany({})

        mongoose.connection.close()
      });



    await test.only('should insert a doc into collection', async () => {
        const silent = new Model({ name: 'Silent'})
        silent.save(async (err,silent)=>{
            if(err) return console.log(err)
            await console.log(`${silent.name} has been saved`)
        })

        const findModel = Model.findOne({name:'Silent'}, 'name'
        ).exec();
        const foundedModel= findModel
        
        expect(foundedModel.name).toBe(silent.name)

        Model.remove({name:"Silent"})
        foundedModel = await findModel
        expect(foundedModel.name).not.toBe(silent.name)
      });
})