// NodeJS: 16.1.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@7.6.0
import * as mongoose from "mongoose"; // mongoose@5.10.18 @types/mongoose@5.10.5

export class User {
  public readonly _id?: mongoose.Types.ObjectId;

  @prop({ required: true, type: () => Date })
  public createdAt!: Date;

  @prop({ type: () => Date })
  public deletedAt!: Date | null;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true, type: () => Date })
  public updatedAt!: Date;

  @prop({ required: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;
}

export const UserModel = getModelForClass(User);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  const doc = await UserModel.create({
    createdAt: new Date(),
    deletedAt: null,
    email: "y",
    updatedAt: new Date(),
    username: "y",
    password: "y",
  });

  console.log(doc);

  await mongoose.disconnect();
})();
