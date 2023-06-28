// NodeJS: 20.2.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@11.3.0
import * as mongoose from 'mongoose'; // mongoose@7.3.1

class User {
  @prop()
  public username?: string;

  public someInstanceMethod!: typeof someInstanceMethod;
}

User.prototype.someInstanceMethod = someInstanceMethod;

const UserModel = getModelForClass(User);

async function main() {
  // await mongoose.connect(`mongodb://localhost:27017/`, {
  //   dbName: 'verifyMASTER',
  // });

  const doc = new UserModel({ username: 'user1' });

  console.log(doc.someInstanceMethod());

  console.log(doc);

  // await mongoose.disconnect();
}

main();

function someInstanceMethod(this: DocumentType<User>) {
  return 'hello';
}
