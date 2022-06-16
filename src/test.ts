// NodeJS: 18.3.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.2
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.9.0
import * as mongoose from 'mongoose'; // mongoose@6.3.5

class form1SubDoc {
  _id?: mongoose.Types.ObjectId;

  @prop({ type: String, required: true })
  public name!: string;

  @prop({ type: String })
  public gender?: string;

  @prop({ type: Number })
  public age?: number;

  @prop({ type: [String] })
  public preferredTags?: string[];
}

// this has to be after "form1SubDoc" because of "Cannot access 'form1SubDoc' before initialization"
class DocSchema {
  @prop({ type: String })
  public identifier?: string;

  @prop({ type: () => form1SubDoc })
  public form1SubDoc?: form1SubDoc;
}

const MainDoc = getModelForClass(DocSchema);

const input = {
  name: 'John Doe',
  gender: 'male',
  age: 28,
  preferredTags: ['JavaScipt', 'Rails', 'AWS'],
};

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'SO72625987',
  });

  const doc = await MainDoc.create({ identifier: '1' });

  console.log(doc);

  const found = await MainDoc.findById(doc._id).orFail().exec();

  found.form1SubDoc = input;
  await found.save();

  const refound = await MainDoc.findById(doc._id).orFail().exec();

  console.log('refound', refound);

  await mongoose.disconnect();
})();
