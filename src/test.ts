// NodeJS: 19.9.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import * as mongoose from 'mongoose'; // mongoose@7.2.1
import { ObjectId } from 'bson';

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  // This needs to be Types.ObjectId so it will be different types
  organizationId: mongoose.Types.ObjectId;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  // And `Schema.Types.ObjectId` in the schema definition.
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
});

const User = mongoose.model<IUser>('User', userSchema);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const user = new User();
  // Property '_id' is missing in type ('bson").ObjectID' but required in type 'import("mongoose").Types.ObjectId'.
  user.organizationId = new ObjectId();

  await mongoose.disconnect();
}

main();
