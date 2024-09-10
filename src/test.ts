// NodeJS: 22.7.0
// MongoDB: 5.0 (Docker)
// Typescript 5.3.3
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.7.0
import * as mongoose from 'mongoose'; // mongoose@8.6.1

// note that this class has to be defined before being used in Animal
// alternatively you could also use "@prop({ type: () => Properties })" instead if defining the "Properties" class after "Animal"
class Properties {
  @prop()
  public hasEaten?: boolean;
}

class Animal {
  @prop()
  public name?: string;

  @prop()
  public properties?: Properties;
}

const AnimalModel = getModelForClass(Animal);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  // directly defining everything
  const doc1 = await AnimalModel.create({ name: 'Kitty', properties: { hasEaten: true } });

  console.log(doc1);

  // properties via some kind of argument
  const props = { hasEaten: false };
  const doc2 = await AnimalModel.create({ name: 'Kitty', properties: props });

  console.log(doc2);

  await mongoose.disconnect();
}

main();
