// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import { getModelForClass, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@13.3.0
import * as mongoose from 'mongoose'; // mongoose@9.6.0

class User {
  @prop()
  public dummy?: string;
}

class Other {
  @prop({ ref: () => User })
  public to: Ref<User>;
}

const userModel = getModelForClass(User);
const otherModel = getModelForClass(Other);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const user = await userModel.create({ dummy: 'hello' });

  const userId = user._id.toString();

  // type error: "Type 'string' is not assignable to ..."
  const other = await otherModel.create({ to: userId });

  console.log('Done', other);

  await mongoose.disconnect();
}

main();
