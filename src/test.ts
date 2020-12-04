// NodeJS: 14.15.1
// MongoDB: 4.2-bionic (Docker)
import { arrayProp, getModelForClass, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@7.4.4
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import * as mongoose from "mongoose"; // mongoose@5.10.18 @types/mongoose@5.10.1

class ExampleEntity extends TimeStamps {
  @prop({ required: true, unique: true, type: String })
  public productId!: string;

  @prop({ required: true, type: () => [SubEntity] })
  public subEntities!: SubEntity[];

  @arrayProp({ required: true, type: () => SubEntity })
  public otherSubEntities!: SubEntity[];
}

class SubEntity {
  @prop({ required: true })
  public length!: number;

  public getInfo() {
    return "this is some info!";
  }
}

const ExampleEntityModel = getModelForClass(ExampleEntity);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  const exampleEntity = new ExampleEntityModel();

  const otherSubEnt = new SubEntity();

  otherSubEnt.length = 25;

  const subEnt = new SubEntity();

  subEnt.length = 100;

  exampleEntity.productId = "blub";
  exampleEntity.subEntities = [subEnt];
  exampleEntity.otherSubEntities = [otherSubEnt];

  await exampleEntity.save();

  const retrieved = await ExampleEntityModel.findById(exampleEntity._id).orFail().exec();

  console.log(retrieved.toJSON({ virtuals: true }));

  retrieved.otherSubEntities.forEach(retSubEnt => {
    // this works!
    console.log(retSubEnt.getInfo());
  });

  retrieved.subEntities.forEach(retSubEnt => {
    // this throws error, 'getInfo is not a function'
    console.log(retSubEnt.getInfo());
  });

  await mongoose.disconnect();
})();
