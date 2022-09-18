// NodeJS: 18.8.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.3
import * as mongoose from 'mongoose'; // mongoose@6.6.1

const userSchema = new mongoose.Schema({
  children: [
    {
      name: String,
    },
  ],
});

const UserModel = mongoose.model('User', userSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = new UserModel(); // default nothing added
  console.log('inital doc', doc);

  doc.children.push({ name: 'hello' });
  console.log('doc after push', doc);

  await doc.save();
  console.log('doc after save', doc);

  await mongoose.disconnect();
})();
