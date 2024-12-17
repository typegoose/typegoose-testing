// NodeJS: 22.8.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { ReturnModelType, getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.10.1
import * as mongoose from 'mongoose'; // mongoose@8.9.1

class Character {
  @prop()
  public name?: string;

  @prop()
  public realmId?: string;

  public static async findByRealmAndName(this: ReturnModelType<typeof Character>, realmId: string, name: string) {
    return this.findOne({
      name,
      realm: realmId,
    })
      .lean()
      .exec();
  }
}

const CharacterModel = getModelForClass(Character);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = new CharacterModel({ username: 'user1' });

  console.log(doc);

  await CharacterModel.findByRealmAndName('test', 'test');

  await mongoose.disconnect();
}

main();
