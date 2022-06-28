// NodeJS: 18.3.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.2
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.9.0
// import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types';
import * as mongoose from 'mongoose'; // mongoose@6.4.1

// type SubDocumentType<T, QueryHelpers = BeAnObject> = DocumentType<T, QueryHelpers> & mongoose.Types.Subdocument;
// type ArraySubDocumentType<T, QueryHelpers = BeAnObject> = DocumentType<T, QueryHelpers> & mongoose.Types.ArraySubdocument;

// class Nested {
//   @prop()
//   public dummy?: string;
// }

// class Parent {
//   @prop()
//   public username?: string;

//   @prop({ type: String })
//   public map?: Map<string, string>;

//   @prop()
//   public nested?: SubDocumentType<Nested>;

//   @prop()
//   public nestedArray?: ArraySubDocumentType<Nested>[];
// }

// const ParentModel = getModelForClass(Parent);

type DocumentType<T> = mongoose.Document<any> & T;
type SubDocumentType<T> = DocumentType<T> & mongoose.Types.Subdocument;
type ArraySubDocumentType<T> = DocumentType<T> & mongoose.Types.ArraySubdocument;

interface Nested {
  dummy?: string;
}

interface Parent {
  username?: string;
  map?: Map<string, string>;
  nested?: SubDocumentType<Nested>;
  nestedArray?: ArraySubDocumentType<Nested>[];
}

const NestedSchema = new mongoose.Schema({
  dummy: { type: String },
});

const ParentSchema = new mongoose.Schema({
  username: { type: String },
  map: { type: Map, of: String },
  nested: { type: NestedSchema },
  nestedArray: [{ type: NestedSchema }],
});

const ParentModel = mongoose.model<DocumentType<Parent>>('Parent', ParentSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = await ParentModel.create({
    username: 'user1',
    map: { key1: 'value1', key2: 'value2' },
    nested: { dummy: 'hello' },
    nestedArray: [{ dummy: 'hello again' }],
  });

  doc.username; // expected type: "string | undefined", actual: "string"
  doc.map; // expected type: "Map<string, string> | undefined", actual: (explicit object)"{ key1: 'value1', key2: 'value2' }"
  const t = doc.map!.get('key1'); // expected type: "string | undefined", actual: function "get" does not exist
  doc.nested; // expected type: "SubDocumentType<Nested> | undefined", actual: (explicit object)"{ dummy: 'hello' }"
  doc.nested!.parent(); // expecting function to exist, actual: function "parent" does not exist
  doc.nestedArray; // expected type: "ArraySubDocumentType<Nested>[] | undefined", actual: (explicit object array)"[{ dummy: 'hello again' }]"
  doc.nestedArray?.[0].parentArray(); // expecting function to exist, actual: function "parentArray" does not exist

  await mongoose.disconnect();
})();
