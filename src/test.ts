// NodeJS: 16.3.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@8.0.0-beta.16
import * as mongoose from "mongoose"; // mongoose@5.12.14

class User {
  @prop()
  public username?: string;
}
const UserModel = getModelForClass(User);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  const doc = new UserModel({ username: "user1" });

  console.log(doc);

  await mongoose.disconnect();
})();
