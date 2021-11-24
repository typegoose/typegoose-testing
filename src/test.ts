// NodeJS: 16.11.1
// MongoDB: 4.2-bionic (Docker)
// import { getModelForClass, prop, Ref, ReturnModelType } from '@typegoose/typegoose'; // @typegoose/typegoose@9.2.0
// import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import * as mongoose from 'mongoose'; // mongoose@6.0.12

// class Nested {
//   @prop()
//   public nested?: string;
// }

// const NestedModel = getModelForClass(Nested);

// class Base {
//   @prop()
//   public something?: string;

//   @prop({ ref: () => Nested })
//   public reference?: Ref<Nested>;
// }

// const BaseModel = getModelForClass(Base);

// function getModelForDb<T extends AnyParamConstructor<any>>(databaseName: string, model: ReturnModelType<T>): ReturnModelType<T> & T {
//   const db = mongoose.connection.useDb(databaseName);

//   const DbModel = db.model(model.modelName, model.schema) as ReturnModelType<T> & T;

//   return DbModel;
// }

const NestedSchema = new mongoose.Schema({ nested: { type: String } });
const NestedModel = mongoose.model('Nested', NestedSchema);

const BaseSchema = new mongoose.Schema({
  something: {
    type: String,
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nested',
  },
});
const BaseModel = mongoose.model('Base', BaseSchema);

function getModelForDb<T>(databaseName: string, model: mongoose.Model<T>): mongoose.Model<T> {
  const db = mongoose.connection.useDb(databaseName);

  const DbModel = db.model(model.modelName, model.schema) as mongoose.Model<T>;

  return DbModel;
}

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyDefault',
  });

  // START SETUP CODE - run once without the code after it

  {
    const nestedInDefault = await NestedModel.create({ nested: 'helloInDefault1' });
    const baseInDefault = await BaseModel.create({ something: 'HelloInDefault2', reference: nestedInDefault });

    const cBaseModel = getModelForDb('verifyChanged', BaseModel);
    const cNestedModel = getModelForDb('verifyChanged', NestedModel);

    const nestedInChanged = await cNestedModel.create({
      _id: new mongoose.Types.ObjectId('619cdac1ce8470ff0831ca1c'),
      nested: 'helloInChanged1',
    });
    const baseInChanged = await cBaseModel.create({
      something: 'helloInChanged2',
      reference: new mongoose.Types.ObjectId('619cdac1ce8470ff0831ca1c'),
    });
  }

  // END SETUP CODE

  // Comment the setup code out after running once, and then comment the following code back in (not the double-commented out things)

  // const cBaseModel = getModelForDb('verifyChanged', BaseModel);
  // // const cNestedModel = getModelForDb('verifyChanged', NestedModel);

  // const baseInChanged = await cBaseModel.create({
  //   something: 'helloInChanged2',
  //   reference: new mongoose.Types.ObjectId('619cdac1ce8470ff0831ca1c') /* nestedInChanged */,
  // });

  // // console.log('nestedInChanged', nestedInChanged);
  // console.log('baseInChanged', baseInChanged);

  // await baseInChanged.populate('reference'); // error here

  // console.log('baseInChanged populated', baseInChanged);

  await mongoose.disconnect();
})();
