/* eslint-disable @typescript-eslint/no-unused-vars */
// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
// import { getModelForClass, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@13.0.0
import * as mongoose from 'mongoose'; // mongoose@9.0.2

interface Schema2 {
  test: string;
}
interface Schema1 {
  test: string;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  refTo: mongoose.PopulatedDoc<mongoose.Document<mongoose.Types.ObjectId, {}, Schema2> & Schema2, mongoose.Types.ObjectId>;
}

const schema1 = new mongoose.Schema({
  test: String,
  refTo: {
    ref: 'Model2',
    type: mongoose.Types.ObjectId,
  },
});
const schema2 = new mongoose.Schema({
  test: String,
});
const model1 = mongoose.model<Schema1>('Model1', schema1);
const model2 = mongoose.model<Schema2>('Model2', schema2);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc2 = await model2.create({ test: 'hello' });
  const doc1 = await model1.create({ test: 'ish', refTo: doc2._id });

  await model1.find({ refTo: doc2 });
  await model1.find({ refTo: doc2._id });
  await model1.find({ refTo: doc2._id.toString() });

  await mongoose.disconnect();
}

main();
