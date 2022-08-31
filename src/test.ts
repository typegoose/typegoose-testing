// NodeJS: 18.7.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.2
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.11.2
import * as mongoose from 'mongoose'; // mongoose@6.5.3

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});
const Model = mongoose.model('Message', MessageSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await Model.create({ text: '1234' });

  const notLean = await Model.findOne({ text: '1234' }).orFail().lean(false);
  const notLean2 = await Model.findOne({ text: '1234' }).orFail();
  const lean = await Model.findOne({ text: '1234' }).orFail().lean(true);
  console.log('lean instanceof Document', lean instanceof mongoose.Document);
  console.log('notLeat instanceof Document', notLean instanceof mongoose.Document);
  console.log('notLean2 instanceof Document', notLean2 instanceof mongoose.Document);
  console.log('lean constructor name', lean.constructor.name);
  console.log('notLean constructor name', notLean.constructor.name);
  console.log('notLean2 constructor name', notLean2.constructor.name);

  await mongoose.disconnect();
})();
