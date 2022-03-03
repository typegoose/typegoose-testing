// NodeJS: 17.6.0
// MongoDB: 4.2-bionic (Docker)
import typegoose from '@typegoose/typegoose'; // @typegoose/typegoose@9.7.0
import mongoose from 'mongoose'; // mongoose@6.2.4

class Dog {
  @typegoose.prop()
  public name?: string;
}

class Cat {
  @typegoose.prop({ ref: () => Dog })
  public partner?: typegoose.Ref<Dog>;

  public async hasPartner(this: typegoose.DocumentType<Cat>) {
    await this.populate('partner');

    if (typegoose.isDocument(this.partner)) {
      console.log(this.partner.name);
    }
  }
}

const DogModel = typegoose.getModelForClass(Dog);
const CatModel = typegoose.getModelForClass(Cat);

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
