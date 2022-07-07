// NodeJS: 18.3.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.4
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.10.1
import { assertion, isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils';
import * as mongoose from 'mongoose'; // mongoose@6.4.2

class Candidates {
  @prop()
  public rate?: number;
}

@modelOptions({ schemaOptions: { collection: 'User' } }) // set to have a known collection for the direct insert
class User {
  @prop({ type: () => [Candidates] })
  public candidates?: Candidates[];
}

const UserModel = getModelForClass(User);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await mongoose.connection.db.collection('User').insertOne({
    _id: new mongoose.Types.ObjectId('62c6bc26ff87d90011ddffff'),
    createdBy: '61ed7d6aa6d0d600112ffff',
    createdAt: '1657191462015',
    projectName: 'Sample Project',
    wid: '62c6bc249daa437de55fffff',
    publicURL: 'https://example.com',
    candidates: [
      {
        rate: 1,
        aid: '62c58d614be5aa0011xxxxx',
        userId: '627bfa7a3538dd0011xxxxx',
        role: '627bfa7a3538dd0011xxxxx',
      },
    ],
    isShared: true,
    sharedBy: '61ed7d6aa6d0d600112xxxx',
    sharedAt: '1657191462015',
  });

  const found = await UserModel.findOne().orFail();

  assertion(!isNullOrUndefined(found.candidates) && found.candidates?.length > 0);

  console.log('found', found);

  await mongoose.disconnect();
})();
