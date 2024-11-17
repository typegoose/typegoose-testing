// NodeJS: 22.8.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { defaultClasses, getDiscriminatorModelForClass, getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.9.0
import * as mongoose from 'mongoose'; // mongoose@8.8.0

@index({ make: 1, color: 1 }, { unique: true, background: false })
@modelOptions({
  schemaOptions: { collection: 'cars', discriminatorKey: 'make' },
})
class Car extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public make!: string;

  @prop({ required: true })
  public color!: string;
}

const CarModel = getModelForClass(Car);

@modelOptions({ options: { disableLowerIndexes: true } })
class Mazda extends Car {}

const MazdaModel = getDiscriminatorModelForClass(CarModel, Mazda, 'mazda');

@modelOptions({ options: { disableLowerIndexes: true } })
class Cadillac extends Car {}

const CadillacModel = getDiscriminatorModelForClass(CarModel, Cadillac, 'cadi');

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await CarModel.syncIndexes();

  // the following 2 dont create any indexes as they dont have any defined
  await MazdaModel.syncIndexes();
  await CadillacModel.syncIndexes();

  await MazdaModel.create({ color: 'blue1' });
  await CadillacModel.create({ color: 'red1' });

  await mongoose.disconnect();
}

main();
