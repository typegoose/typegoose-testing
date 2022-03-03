// NodeJS: 17.6.0
// MongoDB: 4.2-bionic (Docker)
import { DocumentType, getModelForClass, isDocument, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@9.7.0
import * as mongoose from 'mongoose'; // mongoose@6.2.4

class Dog {
  @prop()
  public name?: string;
}

class Cat {
  @prop({ ref: () => Dog })
  public partner?: Ref<Dog>;

  public async hasPartner(this: DocumentType<Cat>) {
    await this.populate('partner');

    if (isDocument(this.partner)) {
      console.log(this.partner.name);
    }
  }
}

const DogModel = getModelForClass(Dog);
const CatModel = getModelForClass(Cat);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const dog1 = await DogModel.create({ name: 'hello' });
  const cat1 = await CatModel.create({ partner: dog1._id });

  const found = await CatModel.findById(cat1._id).orFail().exec();

  await found.hasPartner();

  await await mongoose.disconnect();
})();
