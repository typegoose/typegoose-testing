// NodeJS: 16.11.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.2.0
import { assertion } from '@typegoose/typegoose/lib/internal/utils';
import * as mongoose from 'mongoose'; // mongoose@6.0.12

mongoose.set('debug', true);

const UserSchema = new mongoose.Schema({
  account: {
    username: String,
    email: String,
    password: String,
    twoFactorAuth: Boolean,
    phone: String,
    userImage: String,
  },
  // titles: {
  //   status: String,
  //   bio: String,
  // },
  // activity: {
  //   joined: Date,
  //   rank: [Number],
  //   exp: Number,
  //   seen: Date,
  //   token: String,
  //   lastLogin: Date,
  // },
  // friends: {
  //   friendList: [Number],
  //   friendRequests: [Number],
  //   friendRequestsSent: [Number],
  // },
  // apiReqs: Number,
  // imageApiReqs: Number,
  // id: Number,
});

const UserModel = mongoose.model('user', UserSchema);

console.log('path', UserModel.schema.path('account.username'));

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await UserModel.collection.drop(); // clean collection

  const initDocValid = await UserModel.create({
    account: {
      username: 'aaa',
      email: 'aaa',
      password: 'error',
      twoFactorAuth: false,
    },
    // titles: {
    //   status: "I'm new!",
    // },
    // activity: {
    //   joined: Date.now(),
    //   exp: 0,
    //   seen: Date.now(),
    //   token: 'someRandomHash',
    //   lastLogin: Date.now(),
    //   rank: [1],
    // },
    // friends: {
    //   friendList: [1],
    //   friendRequests: [2],
    //   friendRequestsSent: [3],
    // },
    // apiReqs: 0,
    // imageApiReqs: 0,
    // id: 3,
  });

  const initDocNot = await UserModel.create({
    account: {
      username: 'hello',
      email: 'hello',
      password: 'error2',
      twoFactorAuth: true,
    },
  });

  // not findOne, to test what is actually given back throughout, not just one
  const foundInvalid = await UserModel.find({ username: 'aaa' });

  assertion(foundInvalid.length >= 2);

  // not working
  // const foundValid = await UserModel.find({ account: { username: 'aaa' } });
  // working
  const foundValid = await UserModel.find({ 'account.username': 'aaa' });

  console.log(foundValid);
  assertion(foundValid.length === 1);
  assertion(foundValid[0].account.username === 'aaa');

  await mongoose.disconnect();
})();
