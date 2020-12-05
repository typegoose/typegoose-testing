// NodeJS: 14.15.1
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, isDocument, prop, Ref } from "@typegoose/typegoose"; // @typegoose/typegoose@7.4.4
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { assertion } from "@typegoose/typegoose/lib/internal/utils";
import * as mongoose from "mongoose"; // mongoose@5.10.18 @types/mongoose@5.10.1

class SubEntity {
  @prop({ required: true })
  public length!: number;

  public getInfo() {
    return "this is some info!";
  }
}

class ExampleEntity extends TimeStamps {
  @prop({ required: true, unique: true, type: String })
  public productId!: string;

  @prop({ ref: SubEntity, required: true })
  public referenceEntityA: Ref<SubEntity>;

  @prop({ ref: () => SubEntity, required: true })
  public referenceEntityB: Ref<SubEntity>;
}

const SubEntityModel = getModelForClass(SubEntity);
const ExampleEntityModel = getModelForClass(ExampleEntity);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  await mongoose.connection.db.dropDatabase();

  const exampleEntity = new ExampleEntityModel();

  const otherSubEnt = await SubEntityModel.create({ length: 25 });

  const subEnt = await SubEntityModel.create({ length: 100 });

  exampleEntity.productId = "blub";
  exampleEntity.referenceEntityA = subEnt;
  exampleEntity.referenceEntityB = otherSubEnt;

  await exampleEntity.save();

  const retrieved = await ExampleEntityModel.findById(exampleEntity._id).populate("referenceEntityA referenceEntityB").orFail().exec();

  console.log(retrieved.toJSON({ virtuals: true }));

  assertion(isDocument(retrieved.referenceEntityA));
  assertion(isDocument(retrieved.referenceEntityB));

  console.log(retrieved.referenceEntityA.getInfo());
  console.log(retrieved.referenceEntityB.getInfo());

  await mongoose.disconnect();
})();
