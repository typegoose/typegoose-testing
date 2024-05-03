// NodeJS: 21.6.2
// MongoDB: 5.0 (Docker)
// Typescript 5.3.3
import { ReturnModelType, getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.4.0
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import * as mongoose from 'mongoose'; // mongoose@8.3.3

class AdminLogEntity {
  @prop()
  public username?: string;
}

interface AdminLogSaveParams {
  username?: string,
}

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const session: mongoose.mongo.ClientSession = await mongoose.startSession();
  const adminLogModel: ReturnModelType<typeof AdminLogEntity, BeAnObject> = getModelForClass(AdminLogEntity);
  const options: mongoose.CreateOptions = { session };

  const params = {
    username: 'a',
  }

  const params2: AdminLogSaveParams = {
    username: 'b',
  }

  // This does not work
  const adminLogEntity = await adminLogModel.create(params, options);
  // But the next 2 lines work
  const adminLogEntity2 = await adminLogModel.create(params2, options);
  const adminLogEntity3 = await adminLogModel.create({ username: 'a' }, options);

  console.log('entity', adminLogEntity);
  console.log('entity2', adminLogEntity2);
  console.log('entity3', adminLogEntity3);

  await mongoose.disconnect();
}

main();

