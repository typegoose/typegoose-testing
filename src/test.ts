// NodeJS: 21.6.2
// MongoDB: 5.0 (Docker)
// Typescript 5.3.3
import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.4.0
import * as mongoose from 'mongoose'; // mongoose@8.3.3

class User {
  @prop()
  public username?: string;
}

const UserModel = getModelForClass(User);

function processUser(user: DocumentType<User>): DocumentType<User> {
  // avoid parameter unused warning & function must return something warning
  return user;
}

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const user = await UserModel.findOne({}).orFail().exec();
  const processedUser = processUser(user); // no errors

  console.log(processedUser);

  await mongoose.disconnect();
}

main();
