// NodeJS: 16.3.0
// MongoDB: 4.2-bionic (Docker)
// import { getModelForClass, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@8.0.0-beta.16
import * as mongoose from "mongoose"; // mongoose@5.12.14

const schema1 = new mongoose.Schema({
  someArray: [{
    type: String,
    castNonArrays: false
  }]
});

const model1 = mongoose.model("model1", schema1);

(async () => {
  await mongoose.connect(`mongodb://localhost:44361/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  const newdoc = await model1.create({ someArray: "hello" }); // no validation error

  const found = await model1.findById(newdoc);

  console.log(found);

  await mongoose.disconnect();
})();
