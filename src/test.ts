// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@10.3.2
import * as mongoose from 'mongoose'; // mongoose@6.10.1

@modelOptions({
  options: {
    customName: 'brand',
  },
})
class Brand {
  @prop({})
  public name?: string;
}

class Car {
  @prop()
  name?: string;

  @prop()
  type?: 'SUV' | 'Sedan';

  @prop({ ref: () => Brand })
  brand?: Ref<Brand>;
}

class User {
  @prop()
  name?: string;

  @prop({ type: () => Car })
  // @prop({})
  cars?: Car[];
}

const BrandModel = getModelForClass(Brand);
const UserModel = getModelForClass(User);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const initBrand = await BrandModel.create([
    {
      // _id: '640575efb4187442b1e99bb9',
      name: 'BMW',
    },
    {
      // _id: '640575efb4187442b1eddddd',
      name: 'Audi',
    },
  ]);

  await UserModel.create({
    name: '张三',
    cars: [
      {
        name: 'X5',
        type: 'SUV',
        brand: initBrand[0]._id, //new Types.ObjectId('640575efb4187442b1e99bb9')
      },
      {
        name: 'A6',
        type: 'Sedan',
        brand: initBrand[1]._id,
      },
    ],
  });

  const doc = await UserModel.findOne().orFail();

  const data = await doc.populate('cars.brand');
  //  const data = await u.populate({ path: "cars.brand", model: BrandModel });

  // has proper "cars.brand" field
  console.log('data is ', JSON.stringify(data, null, 2));

  await mongoose.disconnect();
})();
