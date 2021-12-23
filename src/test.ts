// NodeJS: 17.2.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, pre, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.4.0
import * as mongoose from 'mongoose'; // mongoose@6.1.3

@pre<User>('deleteOne', function (...args) {
  console.log('deleteOne hook for User');
  console.log('arguments:', ...args);
  console.log('this:', this);
})
class User {
  @prop()
  public username?: string;
}

const UserModel = getModelForClass(User);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = await UserModel.create({ username: 'hello' });

  // await doc.deleteOne(); // does not trigger hook

  await UserModel.deleteOne({ usernme: 'hello' }); // triggers hook, as "Query"

  await mongoose.disconnect();
})();
