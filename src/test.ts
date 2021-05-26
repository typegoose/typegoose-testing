// NodeJS: 16.1.0
// MongoDB: 4.2-bionic (Docker)
// import { getModelForClass, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@8.0.0-beta.9
import * as mongoose from "mongoose"; // mongoose@5.12.10
import { inspect } from "util";

// class SecondMap {
//   @prop({ _id: false, default: {}, type: Number })
//   public data1?: mongoose.Types.Map<number>;
// }

// class FirstMap {
//   @prop({ _id: false, default: {}, type: () => SecondMap })
//   public data2?: mongoose.Types.Map<SecondMap>;
// }

// class Nested {
//   @prop({ _id: false, default: {}, type: () => SecondMap })
//   public data3?: mongoose.Types.Map<SecondMap>;
// }

// class Test {
//   @prop({ _id: false, default: {}, type: FirstMap })
//   public firstMap?: mongoose.Types.Map<FirstMap>;

//   @prop({ _id: false, default: {} })
//   public nested?: Nested;
// }

// const TestModel = getModelForClass(Test);

const SecondMapSchema = new mongoose.Schema({
  data1: {
    _id: false,
    default: {},
    type: Map,
    of: Number
  }
});
const FirstMapSchema = new mongoose.Schema({
  data2: {
    _id: false,
    default: {},
    type: Map,
    of: SecondMapSchema
  }
});
const NestedSchema = new mongoose.Schema({
  data3: {
    _id: false,
    default: {},
    type: Map,
    of: SecondMapSchema
  }
});
const TestSchema = new mongoose.Schema({
  firstMap: {
    _id: false,
    default: {},
    type: Map,
    of: FirstMapSchema
  },
  nested: {
    _id: false,
    default: {},
    type: NestedSchema
  }
});

const TestModel: any = mongoose.model("Test", TestSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  const doc = await TestModel.create({});

  console.log(inspect(doc, false, 5));
  console.log("Should be empty", doc.modifiedPaths());

  // Ok!
  doc.firstMap.set("first", {});
  console.log("Should include firstMap.first", doc.modifiedPaths());
  await doc.save();

  // Ok!
  doc.firstMap.get("first").data2.set("second", {});
  console.log("Should include firstMap.first.data2.second", doc.modifiedPaths());
  await doc.save();

  // Ok!
  doc.firstMap.get("first").data2.get("second").data1.set("final", 3);
  console.log(
    "Should include firstMap.first.data2.second.data1.final",
    doc.modifiedPaths()
  );
  await doc.save();

  // Ok!
  doc.nested.data3.set("second", {});
  console.log("Should include nested.data3.second", doc.modifiedPaths());
  await doc.save();

  // ERROR!
  console.log("test1", doc.nested.data3);
  doc.nested.data3.get("second").data1.set("final", 3);
  console.log("test2", doc.nested.data3);
  console.log(
    "Should include nested.data3.second.data1.final",
    doc.modifiedPaths()
  );
  await doc.save();

  console.log(inspect(doc, false, 5));

  // This is OK, but have to set "nested" to "{}"
  const okDoc = await TestModel.create({ nested: {} });
  okDoc.nested.data3.set("second", {});
  await okDoc.save();

  okDoc.nested.data3.get("second").data1.set("final", 3);
  console.log(
    "Should include nested.data3.second.data1.final",
    okDoc.modifiedPaths()
  );
  await okDoc.save();

  await mongoose.disconnect();
})();
