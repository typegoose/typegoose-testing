/* eslint-disable @typescript-eslint/no-unused-vars */
// NodeJS: 22.8.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import * as mongoose from 'mongoose'; // mongoose@8.8.0

interface Foo {
  _id: mongoose.Types.ObjectId;
  bar: string;
}
type FooDocument = Foo & mongoose.Document<mongoose.Types.ObjectId>;
type FooLean = mongoose.GetLeanResultType<Foo, Foo, unknown>;

const schema = new mongoose.Schema<Foo>(
  {
    bar: { type: String, required: true },
  },
  { collection: 'foo', timestamps: true }
);

const FooModel = mongoose.model<Foo>('foo', schema);

async function main() {
  const test1: FooLean[] = await FooModel.find({ bar: 'asd' }).lean();
  const test2: Foo[] = await FooModel.find({ bar: 'asd' }).lean();
  // const test3: FooDocument[] = await FooModel.find({ bar: 'asd' }).lean();
}

main();
