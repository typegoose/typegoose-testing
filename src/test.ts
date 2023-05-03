// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
// import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@11.0.2
import { assertion } from '@typegoose/typegoose/lib/internal/utils';
import * as mongoose from 'mongoose'; // mongoose@7.0.5
import { inspect } from 'util';

// @modelOptions({})
// class TestingMultiDimArrays {
//   @prop({ type: Number, items: Number, dim: 2 })
//   public intArray?: number[][];
// }
// const TestingMultiDimArraysModel = getModelForClass(TestingMultiDimArrays);

const schema = new mongoose.Schema({
  intArray: {
    type: [
      [
        {
          type: Number,
        },
      ],
    ],
  },
});

const TestingMultiDimArraysModel = mongoose.model('TestingMultiDimArraysModel', schema);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  let testObj = new TestingMultiDimArraysModel({
    intArray: [
      [1, 2],
      [3, 4],
    ],
  });
  await testObj.save();
  testObj = await TestingMultiDimArraysModel.findById(testObj._id).orFail();

  console.log('testobj', testObj);

  //fails
  // getChanges():
  // {
  //   '$set': {
  //     'intArray.$.0': [ [ undefined, undefined ], [ undefined, undefined ] ]
  //   },
  //   '$inc': { __v: 1 }
  // }
  // save Error:
  // The positional operator did not find the match needed from the query.
  // MongoServerError: The positional operator did not find the match needed from the query
  testObj.intArray![0][0] = 9;
  console.log('changes', inspect(testObj.getChanges(), undefined, Infinity));
  await testObj.save();
  testObj = await TestingMultiDimArraysModel.findById(testObj._id).orFail();
  assertion(testObj.intArray![0][0] === 9);

  await mongoose.disconnect();
}

main();
