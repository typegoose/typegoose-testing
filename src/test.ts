// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import * as mongoose from 'mongoose'; // mongoose@9.1.4

const child = new mongoose.Schema({
  id: Number,
  v: Number,
});

const parent = new mongoose.Schema({
  _id: String,
  array: {
    type: [child],
    _id: false,
  },
});

const TestModel = mongoose.model('test', parent);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await TestModel.deleteOne({ _id: 'test' });
  await TestModel.create({
    _id: 'test',
    array: [
      { id: 1, v: 0 },
      { id: 2, v: 0 },
    ],
  });

  const doc = await TestModel.findById('test').orFail();

  // switch positions
  // @ts-expect-error Type mismatch, assigning a plain array to something that is "DocumentArray"
  doc.array = [doc.array[1], doc.array[0]];
  // [doc.array[1], doc.array[0]] = [doc.array[0], doc.array[1]]; // this one actually works
  await doc.save(); // [ { "id" : 2, "v" : 0 }, { "id" : 1, "v" : 0 } ]
  const fetched1 = await TestModel.findById(doc).orFail().lean();
  // first true { _id: 'test', array: [ { id: 2, v: 0 }, { id: 1, v: 0 } ], __v: 1 }
  console.log('first', JSON.stringify(doc) === JSON.stringify(fetched1));
  console.log('doc', doc);
  console.log('fetched1', fetched1);

  doc.array[0].v = 999;
  // modified [ 'array', 'array.1', 'array.1.v' ]
  // ^ should be "array.0"
  console.log('modified', doc.modifiedPaths());
  await doc.save(); // nothing changed [ { "id" : 2, "v" : 0 }, { "id" : 1, "v" : 0 } ]
  const fetched2 = await TestModel.findById(doc).orFail().lean();
  // second false { _id: 'test', array: [ { id: 2, v: 999 }, { id: 1, v: 0 } ], __v: 1 }
  console.log('second', JSON.stringify(doc) === JSON.stringify(fetched2));
  // { _id: 'test', array: [ { id: 2, v: 999 }, { id: 1, v: 0 } ], __v: 1 }
  console.log('doc', doc);
  // { _id: 'test', array: [ { id: 2, v: 0 }, { id: 1, v: 0 } ], __v: 1 }
  console.log('fetched2', fetched2);

  await mongoose.disconnect();
}

main();
