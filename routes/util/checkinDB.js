const mongoose = require('./mongoose')
const Tokens = require('../forDB/models')

const findModel = Model.findMany({name:'Silent'}, 'name'
).exec();
const foundedModel= findModel
