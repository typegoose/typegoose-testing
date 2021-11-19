// NodeJS: 16.11.1
// MongoDB: 4.2-bionic (Docker)
import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.2.0
import * as mongoose from 'mongoose'; // mongoose@6.0.12

class Child {
  @prop()
  public name?: string;
}

class Parent {
  @prop({ required: true, default: [], type: () => Child })
  public children?: mongoose.Types.DocumentArray<DocumentType<Child>>;
}

const ParentModel = getModelForClass(Parent);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = await ParentModel.create({});

  console.log('before doc', doc);

  const tmp = doc.children!.create({ name: 'test' });

  console.log('generated subdoc', tmp);
  console.log('after doc', doc);

  await mongoose.disconnect();
})();
