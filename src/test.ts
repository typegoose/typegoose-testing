// NodeJS: 22.7.0
// MongoDB: 5.0 (Docker)
// Typescript 5.3.3
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.8.0
import * as mongoose from 'mongoose'; // mongoose@8.7.1
import { AutoIncrementID } from '@typegoose/auto-increment'; // @typegoose/auto-increment@4.7.0
import * as crypto from 'node:crypto';

const userSchema = new mongoose.Schema(
  {
    _id: Number,
    username: {
      type: String,
      required: false,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.plugin(AutoIncrementID, {});

const User = mongoose.model('User', userSchema);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const random = crypto.randomUUID();

  const newUser = await User.create({
    username: 'test' + random,
    email: 'test' + random,
    password: 'test' + random,
  });

  console.log(newUser);

  await mongoose.disconnect();
}

main();
