// NodeJS: 17.6.0
// MongoDB: 4.2-bionic (Docker)
import { prop, getModelForClass } from '@typegoose/typegoose'; // @typegoose/typegoose@9.7.0
import mongoose from 'mongoose'; // mongoose@6.2.4

class User {
  @prop()
  public name?: string;
}

const UserModel = getModelForClass(User);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const cat1 = await UserModel.create({ name: "hello" });

  await await mongoose.disconnect();
})();
