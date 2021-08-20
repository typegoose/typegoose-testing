// NodeJS: 16.7.0
// MongoDB: 4.2-bionic (Docker)
import * as mongoose from "mongoose"; // mongoose@5.13.7

function validateOuter(...args: any[]): boolean {
  console.log("validateOuter1", args.length, args[0].length, ...args); // expecting "validateOuter1 1 2 [{"_id":"611f9876cdb8e5cbede57261","dummyProp":"doc1","__v":0},{"_id":"611f9876cdb8e5cbede57262","dummyProp":"doc2","__v":0}]"
  console.log("validateOuter2", "_id" in args[0][0], "_id" in args[0][1]); // expecting "validateOuter2 true true"

  return true;
}
function validateInner(...args: any[]): boolean {
  console.log("validateInner1", args.length, ...args); // expecting "validateInner1 1 { _id: 611f9876cdb8e5cbede57261, dummyProp: 'doc1', __v: 0 }" x2
  console.log("validateInner2", "_id" in args[0]); // expecting "validateInner2 true" x2

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
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  const references = await NestedModel.create([{ dummyProp: "doc1" }, { dummyProp: "doc2" }]);

  const main = await MainModel.create({ refarray: [...references] });

  console.log("main", main);

  await mongoose.disconnect();
})();
