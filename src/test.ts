// NodeJS: 16.7.0
// MongoDB: 4.2-bionic (Docker)
import * as mongoose from "mongoose"; // mongoose@6.0.0 14dd60be1f11969bcf7c84fe903ffe0471ff1485

function validateOuter(...args: any[]): boolean {
  console.log("validateOuter1", args.length, args[0].length, ...args); // expecting "validateOuter1 1 2 [ new ObjectId("611f98f8ba650a92a093fd2b"), new ObjectId("611f98f8ba650a92a093fd2c") ]"
  console.log("validateOuter2", "_id" in args[0][0], "_id" in args[0][1]); // expecting "validateOuter2 true true"

  return true;
}
function validateInner(...args: any[]): boolean {
  console.log("validateInner1", args.length, ...args); // expecting "validateInner1 1 new ObjectId("611f98f8ba650a92a093fd2b")" x2
  console.log("validateInner2", "_id" in args[0]); // expecting "validateInner2 false" x2

  // but actual output in 6.0 is like in 5.13.7, populated
  // "validateInner1 1 { dummyProp: 'doc1', _id: new ObjectId("611f98f8ba650a92a093fd2b"), __v: 0; }"
  // "validateInner2 true"

  return true;
}

const NestedSchema = new mongoose.Schema({
  dummyProp: String,
});
const MainSchema = new mongoose.Schema({
  refarray: {
    validate: validateOuter,
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nested",
      validate: validateInner,
    }]
  }
});

const NestedModel = mongoose.model("Nested", NestedSchema);
const MainModel = mongoose.model("Main", MainSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { dbName: "verifyMASTER" });

  const references = await NestedModel.create([{ dummyProp: "doc1" }, { dummyProp: "doc2" }]);

  const main = await MainModel.create({ refarray: [...references] });

  console.log("main", main);

  await mongoose.disconnect();
})();
