// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.4
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.13.0
import * as mongoose from 'mongoose'; // mongoose@6.7.3

class User {
  @prop()
  public username?: string;
}

const UserModel = getModelForClass(User);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = new UserModel({ username: 'user1' });

  console.log(doc);

  await mongoose.disconnect();
})();
