// NodeJS: 16.11.0
// MongoDB: 4.2-bionic (Docker)
// import { getDiscriminatorModelForClass, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import * as mongoose from 'mongoose';

const AnimalSchema = new mongoose.Schema(
  {
    patientNumber: {
      required: true,
      unique: true,
      type: String,
    },
  },
  { collection: 'animal' }
);

const DogSchema = AnimalSchema.clone();
DogSchema.add({ cageNumber: { type: String } });

const CatSchema = AnimalSchema.clone();
CatSchema.add({ nameTag: { type: String } });

const AnimalModel = mongoose.model('Animal', AnimalSchema);
const DogModel = AnimalModel.discriminator('Dog', DogSchema, 'Dog');
const CatModel = AnimalModel.discriminator('Cat', CatSchema, 'Cat');

// below are the original typegoose models
// @modelOptions({ schemaOptions: { collection: 'animal' } })
// class Animal {
//   @prop({ required: true, unique: true })
//   public patientNumber!: string;
// }

// class Dog extends Animal {
//   @prop()
//   public cageNumber!: string;
// }

// class Cat extends Animal {
//   @prop()
//   public nameTag!: string;
// }

// const AnimalModel = getModelForClass(Animal);
// const DogModel = getDiscriminatorModelForClass(AnimalModel, Dog);
// const CatModel = getDiscriminatorModelForClass(AnimalModel, Cat);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',

    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  });

  await mongoose.connection.db.dropDatabase();

  const doc1 = await AnimalModel.create({ patientNumber: 'animal-001' });
  const doc2 = await DogModel.create({ patientNumber: 'dog-002', cageNumber: 'dog-002' });
  const doc3 = await CatModel.create({ patientNumber: 'cat-003', nameTag: 'cat-003' });

  const results = await AnimalModel.find({ cageNumber: 'dog-xxx' });
  // on mongoose 5.x the result is: [] (expected)
  // on mongoose 6.x the result is: all 3 documents
  console.log('result', results);

  const found = await AnimalModel.find({ cageNumber: 0 }).exec();
  // on mongoose 5.x the result is: [] (expected)
  // on mongoose 6.x the result is: all 3 documents
  console.log('found', found);

  await mongoose.disconnect();
})();
