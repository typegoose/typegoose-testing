// NodeJS: 19.9.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@11.2.0
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import * as mongoose from 'mongoose'; // mongoose@7.2.1

/// ---------------------
// Example from the documentation via the dual interface & class way
// eslint-disable-next-line @typescript-eslint/no-empty-interface
// interface User extends Base {}

// class User extends TimeStamps {
//   @prop()
//   public username?: string;
// }
/// ---------------------

/// ---------------------
// Example via the "implements" way
class User extends TimeStamps implements Base {
  _id!: mongoose.Types.ObjectId;
  id!: string;
  @prop()
  public username?: string;
}

/// ---------------------

const UserModel = getModelForClass(User);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await UserModel.create({ username: 'hello' });

  const doc = new UserModel({ username: 'user1' });

  console.log(doc);

  // eslint-disable-next-line no-unused-expressions
  doc._id;

  await mongoose.disconnect();
}

main();
