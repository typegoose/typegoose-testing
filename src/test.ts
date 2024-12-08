// NodeJS: 22.8.0
// MongoDB: 7.0 (Docker)
// Typescript 5.7.2
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.9.0
import * as mongoose from 'mongoose'; // mongoose@8.8.4

class User {
  @prop()
  public username?: string;
}

const UserModel = getModelForClass(User);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = new UserModel({ username: 'user1' });

  console.log(doc);

  await mongoose.disconnect();
}

main();
