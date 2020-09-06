// NodeJS: 14.9.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, getName, prop, setLogLevel } from "@typegoose/typegoose"; // @typegoose/typegoose@7.3.5
import { schemas } from "@typegoose/typegoose/lib/internal/data";
import * as mongoose from "mongoose"; // mongoose@5.10.3 @types/mongoose@5.7.36

setLogLevel("DEBUG");

class Nested {
  @prop()
  public proper?: string;
}

class ArrayClass {
  @prop({ type: Nested, dim: 3, required: true })
  public propy!: Nested[][][];
}

// class ArrayClass {
//   @prop({ type: String, dim: 3, required: true })
//   public propy!: string[][][];
// }
const ArrayModel = getModelForClass(ArrayClass);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  const doc = new ArrayModel({ propy: [[["hi"]]] });

  console.log(doc);

  console.log(JSON.stringify(schemas.get(getName(ArrayClass)), null, 2));

  console.log(ArrayModel.schema.path("propy"));

  await mongoose.disconnect();
})();
