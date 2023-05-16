// NodeJS: 19.9.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@11.1.0
import * as mongoose from 'mongoose'; // mongoose@7.1.1

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
