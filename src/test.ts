// NodeJS: 23.4.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.18.0
import * as mongoose from 'mongoose'; // mongoose@8.17.1

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class User {
  @prop({
    type: mongoose.Schema.Types.ObjectId,
    get: (v) => v.toString(),
    set: (v) => new mongoose.Types.ObjectId(v),
  })
  public _id!: string;

  // just as a test it is not just "_id"
  @prop({
    type: mongoose.Schema.Types.ObjectId,
    get: (v) => v.toString(),
    set: (v) => new mongoose.Types.ObjectId(v),
  })
  public email?: string;
}

const UserModel = getModelForClass(User);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = await UserModel.create({ email: new mongoose.Types.ObjectId(), _id: new mongoose.Types.ObjectId() });

  // logs both as "new ObjectId"
  console.log(doc);
  // logs both as "string string"
  console.log(typeof doc._id, typeof doc.email);

  // both return "false"
  console.log('instanceof1', (doc._id as any) instanceof mongoose.Types.ObjectId);
  console.log('instanceof2', (doc.email as any) instanceof mongoose.Types.ObjectId);

  // console.log('schema', UserModel.schema);

  await mongoose.disconnect();
}

main();
