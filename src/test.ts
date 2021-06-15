// NodeJS: 16.1.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, prop, Ref } from "@typegoose/typegoose"; // @typegoose/typegoose@8.0.0-beta.9
import * as mongoose from "mongoose"; // mongoose@5.12.13
import { inspect } from "util";

// class DummyClass {
//   @prop()
//   public dummy?: string;
// }

// class TestClass {
//   @prop({ ref: () => DummyClass })
//   public testprop?: Map<string, Ref<DummyClass>>;
// }
// const DummyModel = getModelForClass(DummyClass);
// const TestModel = getModelForClass(TestClass);

const DummySchema = new mongoose.Schema({
  dummy: String
});
const TestSchema = new mongoose.Schema({
  testprop: {
    type: Map,
    of: mongoose.Schema.Types.ObjectId,
    ref: "dummy"
  }
});

const DummyModel = mongoose.model("dummy", DummySchema);
const TestModel = mongoose.model("test", TestSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  console.log("schema path", TestModel.schema.path("testprop"));

  const dummy_doc1 = await DummyModel.create({ dummy: "hello1" });
  const dummy_doc2 = await DummyModel.create({ dummy: "hello2" });

  const test_doc1 = await TestModel.create({ testprop: [["hello1", dummy_doc1], ["hello2", dummy_doc2]] });

  const found_doc1 = await TestModel.findById(test_doc1).orFail().exec();

  console.log("found", inspect(found_doc1, false, 5));

  await found_doc1.populate("testprop.$*").execPopulate();

  console.log("populated", inspect(found_doc1, false, 5));

  await mongoose.disconnect();
})();
