// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import { DocumentType, getModelForClass, plugin, prop, ReturnModelType } from '@typegoose/typegoose'; // @typegoose/typegoose@13.0.0
import mongoose from 'mongoose'; // mongoose@9.0.2
import paginatePlugin from 'mongoose-paginate-v2';

@plugin(paginatePlugin)
class User {
  @prop()
  public username?: string;
}

const UserModel = getModelForClass(User) as ReturnModelType<typeof User> & Pick<mongoose.PaginateModel<DocumentType<User>>, 'paginate'>;

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const result = await UserModel.paginate({}, { page: 0, limit: 10 });
  console.log('docs', result.docs);

  if (result.docs.length > 0) {
    const id = result.docs[0]._id;
    console.log('id of first', id);
  }

  await mongoose.disconnect();
}

main();
