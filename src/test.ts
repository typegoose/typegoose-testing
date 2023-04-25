// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import * as mongoose from 'mongoose'; // mongoose@7.0.3

const schema1 = new mongoose.Schema({
  normalProp: String,
});

schema1.virtual('virtProp').get(() => 'hello1');

const model1 = mongoose.model('Test1', schema1);

const doc1 = new model1({ normalProp: 'normal1' });

console.log('1normal', doc1);
console.log('1toJSON virtuals', doc1.toJSON({ virtuals: true }));
console.log('1toObject virtuals', doc1.toObject({ virtuals: true }));

const schema2 = new mongoose.Schema(
  {
    normalProp: String,
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

schema2.virtual('virtProp').get(() => 'hello2');

const model2 = mongoose.model('Test2', schema2);

const doc2 = new model2({ normalProp: 'normal2' });

console.log('2normal', doc2);
console.log('2toJSON', doc2.toJSON());
console.log('2toObject', doc2.toObject());
