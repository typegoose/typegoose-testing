// NodeJS: 14.15.3
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, prop, Ref } from "@typegoose/typegoose"; // @typegoose/typegoose@7.4.6
import * as mongoose from "mongoose"; // mongoose@5.10.18 @types/mongoose@5.10.3

class Y {
  @prop()
  public dummy?: string;
}

const YModel = getModelForClass(Y);

class X {
  @prop({ required: true, ref: 'Y' })
  public a!: Ref<Y>;
  @prop({ required: true, ref: 'Y' })
  public b!: Ref<Y>;
}
const XModel = getModelForClass(X);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verify467", useCreateIndex: true, useUnifiedTopology: true });

  // fails
  // {
  //   const y1 = new YModel({ dummy: "hi1" });
  //   const x1 = new XModel({});

  //   await x1.validate(); // should fail, because both "a" and "b" are missing
  // }

  // fails
  // {
  //   const y1 = new YModel({ dummy: "hi2" });
  //   const x1 = new XModel({ a: y1 });

  //   await x1.validate(); // should fail, because "b" is missing
  // }

  // fails
  // {
  //   const y1 = new YModel({ dummy: "hi3" });
  //   const x1 = new XModel({ b: y1 });

  //   await x1.validate(); // should fail, because "a" is missing
  // }

  // runs
  {
    const y1 = new YModel({ dummy: "hi4" });
    const y2 = new YModel({ dummy: "hi5" });
    const x1 = new XModel({ a: y1, b: y2 });

    await x1.validate(); // should not fail
  }

  await mongoose.disconnect();
})();
