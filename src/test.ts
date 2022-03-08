// NodeJS: 17.6.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, modelOptions, prop, PropType, Severity } from '@typegoose/typegoose'; // @typegoose/typegoose@9.7.0
import * as mongoose from 'mongoose'; // mongoose@6.2.4

// Original Typegoose Definition
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    collection: 'ResourceParameter',
  },
})
class ResourceParameter {
  @prop()
  public value: any;
}

abstract class Resource {
  @prop({ type: () => ResourceParameter, _id: true }, PropType.MAP)
  public parameters: Map<string, ResourceParameter> = new Map<string, ResourceParameter>();
}

@modelOptions({
  schemaOptions: {
    collection: 'ObjectNested',
  },
})
class ObjectNested extends Resource {
  private dummy?: never;
}

@modelOptions({
  schemaOptions: {
    collection: 'ObjectMain',
  },
})
class ObjectMain extends Resource {
  @prop({ type: () => ObjectNested })
  public object_nested?: ObjectNested;
}

const ObjectMainModel = getModelForClass(ObjectMain);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const objectMain = new ObjectMain();

  const resourceParameter1 = new ResourceParameter();
  resourceParameter1.value = 'Hello I am a nested resource parameter';
  objectMain.parameters.set('param1', resourceParameter1);

  objectMain.object_nested = new ObjectNested();

  const resourceParameter2 = new ResourceParameter();
  resourceParameter2.value = 'Hello I am a nested resource parameter';
  objectMain.object_nested.parameters.set('param2', resourceParameter2);

  console.log('before create');

  await ObjectMainModel.create(objectMain); // TypeError: Cannot read properties of undefined (reading 'validate')

  await mongoose.disconnect();
})();
