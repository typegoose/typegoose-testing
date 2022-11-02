// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.4
import * as mongoose from 'mongoose'; // mongoose@6.6.5
import { ObjectId } from 'bson';

interface IUser {
  name: string;
  email: string;
  organizationId: ObjectId;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
});

const User = mongoose.model<IUser>('User', userSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const user = new User();
  user.organizationId = new ObjectId();

  await mongoose.disconnect();
})();
