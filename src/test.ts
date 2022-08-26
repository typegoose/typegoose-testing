// NodeJS: 18.7.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.4
import * as mongoose from 'mongoose'; // mongoose@6.5.2

const userSchema = new mongoose.Schema({ prop1: String });

const UserModel = mongoose.model('User', userSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  mongoose.set('debug', true);

  // Mongoose: users.remove({}, {})
  // remove { acknowledged: true, deletedCount: 0 }
  console.log('remove', await UserModel.remove({ nonExistent: true }));
  // Mongoose: users.deleteOne({}, {})
  // deleteOne { acknowledged: true, deletedCount: 0 }
  console.log('deleteOne', await UserModel.deleteOne({ nonExistent: true }));
  // Mongoose: users.deleteMany({}, {})
  // deleteMany { acknowledged: true, deletedCount: 0 }
  console.log('deleteMany', await UserModel.deleteMany({ nonExistent: true }));

  await mongoose.disconnect();
})();
