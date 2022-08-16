// NodeJS: 18.7.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.4
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.11.0
import * as mongoose from 'mongoose'; // mongoose@6.5.2

// class BaseModelClass {
//   @prop()
//   public firstname?: string;
// }

// const BaseModel = getModelForClass(BaseModelClass);

type DocumentType<T> = mongoose.Document<any, any, T> & T;

interface BaseModelClassDoc {
  firstname: string;
}

const baseModelClassSchema = new mongoose.Schema({
  firstname: String,
});

const BaseModel = mongoose.model<mongoose.Model<DocumentType<BaseModelClassDoc>>>('test', baseModelClassSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await BaseModel.bulkWrite([
    {
      updateOne: {
        update: {
          firstname: 'test', // Type instantiation is excessively deep and possibly infinite.ts(2589)
        },
        filter: {
          firstname: 'asdsd',
        },
      },
    },
  ]);

  await mongoose.disconnect();
})();
