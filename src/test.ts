// NodeJS: 22.8.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.10.1
import * as mongoose from 'mongoose'; // mongoose@8.9.1

// @modelOptions({ options: { } })
abstract class AbstractPojo<T> {
  @prop()
  _id?: mongoose.Types.ObjectId | string | number; // https://stackoverflow.com/questions/75316899/using-mongo-objectid-as-an-index

  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  selected?: boolean;

  protected constructor(anatomy: Partial<T> = {}) {
    Object.assign(this, anatomy);
  }

  clone?(rhs: any): T {
    return { ...rhs };
  }

  isEqual?(rhs: any): boolean {
    return this.hash!() === rhs.hash();
  }

  hash?(): string {
    return this._id === undefined ? '' : this._id.toString(); /// saves all index subscript errors
  }
}

// @modelOptions({ options: { automaticName: true, allowMixed: Severity.ALLOW } })
class PermissionPojo extends AbstractPojo<PermissionPojo> {
  @prop()
  name!: string;

  @prop()
  displayName!: string;

  @prop()
  description!: string;

  constructor(anatomy: Partial<PermissionPojo> = {}) {
    super(anatomy);
  }
}

// The following values were basically unused in the repro code, hence commented out

// const PermissionPojoModel = getModelForClass(PermissionPojo);

// const PermissionPojoSchema = /* SchemaFactory.createForClass */ buildSchema(PermissionPojo);

// const docPermissionPojo = new PermissionPojoModel();

// const PermissionSchema = /* SchemaFactory.createForClass */ buildSchema(PermissionPojo);

// const PermissionMongooseModel = mongoose.model('permission', PermissionSchema);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const session: mongoose.mongo.ClientSession = await mongoose.startSession();
  const model /* : ReturnModelType<typeof PermissionPojoModel, BeAnObject> */ = getModelForClass(PermissionPojo);
  const options: mongoose.CreateOptions = { session };

  // const entity = await model.deleteOne({}, options);
  const entity = await model.create([{ _id: 'test' }], options);

  console.log('entity', entity);

  await mongoose.disconnect();
}

main();
