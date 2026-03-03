// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@13.2.0
import * as mongoose from 'mongoose'; // mongoose@9.2.3

class Foo {
  @prop()
  name: string;
}

const FooModel = getModelForClass(Foo);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const foo: DocumentType<Foo> = new FooModel({
    name: 'test',
  });

  // Typescript error when using DocumentType<T>
  await FooModel.bulkSave([foo]);

  await mongoose.disconnect();
}

main();
