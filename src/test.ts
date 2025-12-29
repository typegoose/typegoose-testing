// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@13.0.0
import * as mongoose from 'mongoose'; // mongoose@9.0.2

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
