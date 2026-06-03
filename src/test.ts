// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import * as mongoose from 'mongoose'; // mongoose@9.6.0

interface User {
  dummy: string;
}

interface Other {
  to: mongoose.PopulatedDoc<User>;
}

const userSchema = new mongoose.Schema({ dummy: String });
const userModel = mongoose.model<User>('user', userSchema);

const otherSchema = new mongoose.Schema({ to: { type: mongoose.Types.ObjectId, ref: 'user' } });
const otherModel = mongoose.model<Other>('other', otherSchema);

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
