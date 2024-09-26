// NodeJS: 22.7.0
// MongoDB: 5.0 (Docker)
// Typescript 5.3.3
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.7.0
import * as mongoose from 'mongoose'; // mongoose@8.6.1

class User {
  @prop()
  public username?: string;

  constructor(
    @prop() public test?: string,
    public t?: any,
    @prop() public s?: number
  ) {}
}

const UserModel = getModelForClass(User);

console.log('test', UserModel.schema);

// async function main() {
//   await mongoose.connect(`mongodb://localhost:27017/`, {
//     dbName: 'verifyMASTER',
//   });

//   const doc = new UserModel({ username: 'user1' });

//   console.log(doc);

//   await mongoose.disconnect();
// }

// main();
