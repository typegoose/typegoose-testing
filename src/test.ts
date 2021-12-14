// NodeJS: 17.1.0
// MongoDB: 4.2-bionic (Docker)
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.3.1
import * as mongoose from 'mongoose'; // mongoose@6.0.14

// class User {
//   @prop()
//   public username?: string;
// }

// const UserModel = getModelForClass(User);

class User {
  public username?: string;
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
});

const UserModel: mongoose.Model<User> = mongoose.model('User', UserSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = await UserModel.create({ username: 'hello' });
  await doc.updateOne(doc);

  await mongoose.disconnect();
})();
