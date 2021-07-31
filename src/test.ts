// NodeJS: 16.4.1
// MongoDB: 4.2-bionic (Docker)
// import { getModelForClass, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@8.0.0
import * as mongoose from "mongoose"; // mongoose@5.13.5

function referenceValidate(arg1: any) {
  // output in mongoose 5.13.5 is:
  // arg1 { _id: 610555f50ce8361e51d60838, dummy: 'hello', __v: 0 } object true false
  console.log("arg1", arg1, typeof arg1, arg1 instanceof mongoose.Model, arg1 instanceof mongoose.Types.ObjectId);

  return true;
}

const DummySchema = new mongoose.Schema({ dummy: String });
const DummyModel = mongoose.model("Dummy", DummySchema);

const NormalSchema = new mongoose.Schema({
  refProp: {
    ref: "Dummy",
    type: mongoose.Schema.Types.ObjectId,
    validate: referenceValidate,
  }
});
const NormalModel = mongoose.model("Normal", NormalSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  const dummyDoc = await DummyModel.create({ dummy: "hello" });

  const normalDoc = await NormalModel.create({ refProp: dummyDoc });

  await mongoose.disconnect();
})();
