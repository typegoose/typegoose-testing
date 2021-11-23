// NodeJS: 16.11.1
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, prop, Ref, ReturnModelType } from '@typegoose/typegoose'; // @typegoose/typegoose@9.2.0
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import * as mongoose from 'mongoose'; // mongoose@6.0.12

class Nested {
  @prop()
  public nested?: string;
}

const NestedModel = getModelForClass(Nested);

class Base {
  @prop()
  public something?: string;

  @prop({ ref: () => Nested })
  public reference?: Ref<Nested>;
}

const BaseModel = getModelForClass(Base);

function getModelForDb<T extends AnyParamConstructor<any>>(databaseName: string, model: ReturnModelType<T>): ReturnModelType<T> & T {
  const db = mongoose.connection.useDb(databaseName);

  const DbModel = db.model(model.modelName, model.schema) as ReturnModelType<T> & T;

  return DbModel;
}

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyDefault',
  });

  const nestedInDefault = await NestedModel.create({ nested: 'helloInDefault1' });
  const baseInDefault = await BaseModel.create({ something: 'HelloInDefault2', nested: nestedInDefault });

  console.log('nestedInDefault', nestedInDefault);
  console.log('baseInDefault', baseInDefault);

  // purposefully in a different order
  const cBaseModel = getModelForDb('verifyChanged', BaseModel);
  const cNestedModel = getModelForDb('verifyChanged', NestedModel);

  const nestedInChanged = await cNestedModel.create({ nested: 'helloInChanged1' });
  const baseInChanged = await cBaseModel.create({ something: 'helloInChanged2', nested: nestedInChanged });

  console.log('nestedInChanged', nestedInChanged);
  console.log('baseInChanged', baseInChanged);

  await mongoose.disconnect();
})();
