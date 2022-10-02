// NodeJS: 18.8.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.3
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.12.0
import * as mongoose from 'mongoose'; // mongoose@6.6.3

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
