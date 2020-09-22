// NodeJS: 14.10.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, pre, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@7.4.0
import * as mongoose from "mongoose"; // mongoose@5.10.6 @types/mongoose@5.7.36

async function somefunction() { // to have like in the example
  return "t";
}

@pre<User>("save", async function () {
  this.username = await somefunction();
})
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
