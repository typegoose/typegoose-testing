// NodeJS: 18.6.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.4
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.11.0
import * as mongoose from 'mongoose'; // mongoose@6.5.0

const CarSchema = new mongoose.Schema({
  color: String,
  model: String,
});

const PersonSchema = new mongoose.Schema({
  name: String,
  cars: [CarSchema],
});

const PersonModel = mongoose.model('Person', PersonSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const newDoc = await new PersonModel({ name: 'Vasya Pupkin' });
  const car = newDoc.cars.create({ model: 'VAZ 2101', color: 'black' });
  newDoc.cars.push(car);
  await newDoc.save();

  {
    console.log('variant 1:');
    const foundDoc = await PersonModel.findById(newDoc._id)
      .orFail()
      // comment to let it stay formatted
      .select('cars.color')
      // .select('cars.model')
      // .select('cars.$')
      .exec();
    console.log('color: isSelected = ', foundDoc.isSelected('color')); // returns "false"
    console.log('model: isSelected = ', foundDoc.isSelected('model')); // returns "false"
  }

  {
    console.log('variant 2:');
    const foundDoc = await PersonModel.findById(newDoc._id)
      .orFail()
      // comment to let it stay formatted
      // .select('cars.color')
      .select('cars.model')
      // .select('cars.$')
      .exec();
    console.log('color: isSelected = ', foundDoc.isSelected('color')); // returns "false"
    console.log('model: isSelected = ', foundDoc.isSelected('model')); // returns "false"
  }

  {
    console.log('variant 3:');
    const foundDoc = await PersonModel.findById(newDoc._id)
      .orFail()
      // comment to let it stay formatted
      // .select('cars.color')
      // .select('cars.model')
      .select('cars')
      .exec();
    console.log('color: isSelected = ', foundDoc.isSelected('color')); // returns "false"
    console.log('model: isSelected = ', foundDoc.isSelected('model')); // returns "false"
  }

  await mongoose.disconnect();
})();
