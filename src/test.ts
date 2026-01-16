// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@13.0.0
import * as mongoose from 'mongoose'; // mongoose@9.0.2

class TestArray {
  @prop()
  public id!: number;

  @prop()
  public v!: number;
}

class TestData {
  @prop()
  public _id!: string;

  @prop({ type: () => [TestArray], _id: false })
  public array: TestArray[];
}

const TestModel = getModelForClass(TestData, {
  schemaOptions: { collection: 'test' },
});

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await TestModel.deleteOne({ _id: 'test' });
  await TestModel.create({ _id: 'test', array: [] });

  const doc = await TestModel.findById('test').orFail();

  // [ { "id" : 1, "v" : 0 }, { "id" : 2, "v" : 0 } ]
  doc.array = [
    { id: 1, v: 0 },
    { id: 2, v: 0 },
  ];
  await doc.save(); // [ { "id" : 2, "v" : 0 }, { "id" : 1, "v" : 0 } ]
  const fetched1 = await TestModel.findById(doc).orFail().lean();
  console.log('first', JSON.stringify(doc) === JSON.stringify(fetched1), doc);

  doc.array[0].v = 999;
  await doc.save(); // nothing changed [ { "id" : 2, "v" : 0 }, { "id" : 1, "v" : 0 } ]
  const fetched2 = await TestModel.findById(doc).orFail().lean();
  console.log('second', JSON.stringify(doc) === JSON.stringify(fetched2), doc);

  await mongoose.disconnect();
}

main();
