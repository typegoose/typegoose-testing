// NodeJS: 18.8.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.3
import * as mongoose from 'mongoose'; // mongoose@6.6.1

const userSchema = new mongoose.Schema(
  {
    uuid: String,
    addresses: [
      new mongoose.Schema(
        {
          location: String,
        },
        { timestamps: true }
      ),
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  let uuid = 'saveOp';
  const home = { location: 'earth' };

  const example = new User({ uuid, addresses: [home] });
  mongoose.set('debug', true);
  await example.save();

  uuid = 'upsertOp';

  const query = User.findOneAndUpdate({ uuid }, { uuid, $push: { addresses: home } }, { upsert: true, new: true, runValidators: true });
  await query;

  await mongoose.disconnect();
})();
