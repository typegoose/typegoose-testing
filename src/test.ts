// NodeJS: 18.3.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.2
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.9.0
import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types';
import * as mongoose from 'mongoose'; // mongoose@6.3.9

type SubDocumentType<T, QueryHelpers = BeAnObject> = DocumentType<T, QueryHelpers> & mongoose.Types.Subdocument;
type ArraySubDocumentType<T, QueryHelpers = BeAnObject> = DocumentType<T, QueryHelpers> & mongoose.Types.ArraySubdocument;

class Nested {
  @prop()
  public dummy?: string;
}

class Parent {
  @prop()
  public username?: string;

  @prop({ type: String })
  public map?: Map<string, string>;

  @prop()
  public nested?: SubDocumentType<Nested>;

  @prop()
  public nestedArray?: ArraySubDocumentType<Nested>[];
}

const ParentModel = getModelForClass(Parent);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = new ParentModel({
    username: 'user1',
    map: { key1: 'value1', key2: 'value2' },
    nested: { dummy: 'hello' },
    nestedArray: [{ dummy: 'hello again' }],
  });

  doc.username; // expected type: "string | undefined"
  doc.map; // expected type: "Map<string, string> | undefined"
  const t = doc.map!.get('key1'); // expected type: "string | undefined"
  doc.nested; // expected type: "SubDocumentType<Nested> | undefined"
  doc.nested!.parent(); // expecting function to exist
  doc.nestedArray; // expected type: "ArraySubDocumentType<Nested>[] | undefined"
  doc.nestedArray?.[0].parentArray(); // expecting function to exist

  await mongoose.disconnect();
})();
