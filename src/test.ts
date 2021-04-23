// NodeJS: 14.16.1
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@8.0.0-beta.5
import * as mongoose from "mongoose"; // mongoose@5.12.5

@modelOptions({ schemaOptions: { collection: "Something" } })
class MultiModel {
  @prop()
  public dummy?: string;
}

const model = getModelForClass(MultiModel);
// expect(model.modelName).to.be.equal('MultiModel'); // changed to "console.log" for visual
console.log("ModelName", model.modelName); // expecting "MultiModel"
