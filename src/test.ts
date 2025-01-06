// NodeJS: 22.8.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.10.1
import * as mongoose from 'mongoose'; // mongoose@8.9.1

class Base {
  @prop()
  public _id!: string;
}

class User extends Base {
  @prop()
  public username?: string;
}

const UserModel = getModelForClass(User);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = new UserModel({ _id: 'hello', username: 'name' });

  console.log(doc);

  await mongoose.disconnect();
}

main();
