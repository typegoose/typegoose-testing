// NodeJS: 23.4.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.12.0
import * as mongoose from 'mongoose'; // mongoose@8.11.0

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
