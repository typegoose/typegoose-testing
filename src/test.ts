// NodeJS: 18.8.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.3
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.12.0
import * as mongoose from 'mongoose'; // mongoose@6.6.1
import { MongoMemoryReplSet } from 'mongodb-memory-server';

class User {
  @prop()
  public username?: string;

  @prop()
  public someCount?: number;
}

const UserModel = getModelForClass(User);

(async () => {
  const instance = await MongoMemoryReplSet.create({
    replSet: {
      count: 3,
      storageEngine: 'wiredTiger',
    },
  });

  console.log('ReplSet started');

  await mongoose.connect(instance.getUri(), {
    dbName: 'verifyMASTER',
  });

  console.log('mongoose connected');

  UserModel.watch().on('change', (doc) => {
    console.log('CHANGE');
  });

  const doc = await UserModel.create({ username: 'hello', someCount: 0 });

  console.log('running while');

  let times = 10;

  while (times > 0) {
    await sleep(1000);

    await UserModel.findOneAndUpdate({ _id: doc._id }, { $inc: { someCount: 1 } });
    times -= 1;
  }

  console.log('stopping');

  await mongoose.disconnect();
  await instance.stop();
})();

function sleep(time: number) {
  return new Promise((res) => setTimeout(res, time));
}
