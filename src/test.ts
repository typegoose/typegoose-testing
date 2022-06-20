// NodeJS: 18.3.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.2
import { getDiscriminatorModelForClass, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.9.0
import * as mongoose from 'mongoose'; // mongoose@6.3.5

enum Kinds {
  EXTEND1 = 'extend1',
  EXTEND2 = 'extend2',
}

@modelOptions({ schemaOptions: { discriminatorKey: 'kind' } })
class Main {
  @prop()
  public shared?: string;

  @prop({ required: true, enum: Kinds })
  public kind!: string;
}

class Extend1 extends Main {
  @prop()
  public extend1?: string;
}

class Extend2 extends Main {
  @prop()
  public extend2?: string;
}

const MainModel = getModelForClass(Main);
const Extend1Model = getDiscriminatorModelForClass(MainModel, Extend1, Kinds.EXTEND1);
const Extend2Model = getDiscriminatorModelForClass(MainModel, Extend2, Kinds.EXTEND2);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'discordAddamsson',
  });

  const extend1doc = await Extend1Model.create({ shared: '1', extend1: 'hello1' });
  const extend2doc = await Extend2Model.create({ shared: '2', extend2: 'hello2' });

  const foundDocs = await MainModel.find().exec();

  console.log('found', foundDocs);

  await mongoose.disconnect();
})();
