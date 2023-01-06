// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.4
import * as mongoose from 'mongoose'; // mongoose@6.8.0

interface IUser {
  username: string;
  test(): void;
}

const UserModel = mongoose.model<IUser>('User', new mongoose.Schema({ username: String }, { methods: { test() {} } }));

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await UserModel.create({ username: 'hello' });

  const doc = await UserModel.findOne({}).orFail().lean();
  doc.test(); // should give a type error

  await mongoose.disconnect();
})();
