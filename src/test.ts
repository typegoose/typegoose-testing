// NodeJS: 20.2.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@11.4.0
import * as mongoose from 'mongoose'; // mongoose@7.4.0

@modelOptions({
  schemaOptions: {
    _id: false,
    discriminatorKey: 'component',
  },
})
export class Component {
  @prop({ required: true, type: String })
  component!: string;

  @prop({ required: true, type: String })
  something!: string;
}

export class ComponentA extends Component {
  constructor() {
    super();

    this.component = 'a';
  }

  @prop({ trim: true, type: String })
  name?: string;
}

class Module {
  @prop({
    required: true,
    type: Component,
    discriminators: () => [{ type: ComponentA, value: 'a' }],
  })
  components!: Component[];
}

export class Config {
  @prop({ required: true, type: String })
  type!: string;

  @prop({ required: true, type: Module })
  modules!: Module[];
}

const ConfigModel = getModelForClass(Config);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  mongoose.set('debug', true);

  const doc = await ConfigModel.create({
    type: 'test',
    modules: [
      { components: { component: 'a', something: 'test', name: 'testy' } },
      { components: { component: 'a', something: 'test2', name: 'testy2' } },
    ],
  });

  await ConfigModel.findOneAndUpdate(
    {
      _id: doc._id,
    },
    {
      $set: { 'modules.$[].components.$[j].name': 'hello' },
    },
    {
      arrayFilters: [{ 'j.something': 'test' }],
    }
  );

  await mongoose.disconnect();
}

main();
