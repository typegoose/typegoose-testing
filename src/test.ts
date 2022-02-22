// NodeJS: 17.3.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.6.2
import * as mongoose from 'mongoose'; // mongoose@6.2.2

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
