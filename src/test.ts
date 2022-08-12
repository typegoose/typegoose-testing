// NodeJS: 18.7.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.4
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.11.0
import { isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils'; // using typegoose's utils for convienence because nodejs's is deprecated
import * as mongoose from 'mongoose'; // mongoose@6.5.2

function numberRangeMinValidator(this: any, value: any) {
  const max = this.max;
  console.log('value: ', value, ' max: ', max, ' this: ', this);

  return isNullOrUndefined(max) ? true : max >= value;
}

function numberRangeMaxValidator(this: any, value: any) {
  const min = this.min;
  console.log('value: ', value, ' min: ', min, ' this: ', this);

  return isNullOrUndefined(min) ? true : min <= value;
}

const numberRange = new mongoose.Schema(
  {
    min: { type: Number, min: 0, validate: { validator: numberRangeMinValidator } },
    max: { type: Number, max: 100000000, validate: { validator: numberRangeMaxValidator } },
  },
  { versionKey: false, _id: false }
);

const childSchema = new mongoose.Schema(
  {
    name: 'string',
    price: { type: numberRange },
    area: { type: numberRange },
  },
  { _id: false, versionKey: false, strict: true }
);

const parentSchema = new mongoose.Schema(
  {
    size: { type: numberRange },
    child: { type: childSchema },
  },
  { versionKey: false, strict: true }
);

const Parent = mongoose.model('Parent', parentSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const parent = new Parent({ size: { min: 10, max: 8 }, child: { name: 'Luke', price: { min: 5, max: 4 }, area: { min: 24, max: 20 } } });
  parent.save(function (err) {
    if (err) {
      throw err;
    }

    mongoose.disconnect();
  });

  await mongoose.disconnect();
})();
