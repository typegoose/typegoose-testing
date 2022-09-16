// NodeJS: 18.7.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.2
import * as mongoose from 'mongoose'; // mongoose@6.3.5

// Test #1
// mongoose.set('toObject', { virtuals: true });

const schema = new mongoose.Schema(
  {
    prop1: String,
  },
  {
    // Test #2
    // toObject: {
    //   virtuals: true,
    // },
  }
);

// the virtual to test
schema.virtual('test').get(() => 1);

const model = mongoose.model('Test', schema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = new model({ username: 'user1' });

  // in 6.3.5 this always outputs the correct setting
  console.log(doc.toObject());
  // the following always works and is used a control
  console.log(doc.toObject({ virtuals: true }));

  await mongoose.disconnect();
})();
