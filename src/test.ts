// NodeJS: 16.6.1
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@8.1.1
import * as mongoose from "mongoose"; // mongoose@6.0.0-rc1
import { classToPlain, Exclude, Expose, plainToClass, Transform } from "class-transformer"; // class-transformer@0.4.0

// re-implement base Document to allow class-transformer to serialize/deserialize its properties
// This class is needed, otherwise "_id" and "__v" would be excluded from the output
class DocumentCT {
  @Expose()
  // makes sure that when deserializing from a Mongoose Object, ObjectId is serialized into a string
  @Transform(
    (value: any) => {
      if ("value" in value) {
        console.log("value", value);
        if (value.value !== value.obj[value.key]) {
          console.log("value and obj.key are different!");
        }

        return value.value.toString(); // because "toString" is also a wrapper for "toHexString"
      }

      return "unknown value";
    },
    { toClassOnly: true }
  )
  public _id!: string;

  @Expose()
  public __v!: number;
}

@Exclude()
class Account extends DocumentCT {
  @prop()
  @Expose()
  public email?: string;

  @prop()
  @Expose({ groups: ["admin"] })
  public password?: string;
}

const AccountModel = getModelForClass(Account);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { dbName: "verifyMASTER" });

  let id: string;
  // Init

  const { _id } = await AccountModel.create({
    email: "somebody@gmail.com",
    password: "secret",
  } as Account);
  // note here that _id is an ObjectId, hence the toString()
  // otherwise it will have the shape of : { _bsonType: 'ObjectId', id: ArrayBuffer }
  id = _id.toString();

  // first test

  console.log("saved", id);
  // lean return a Plain Old Javascript Object
  const pojo = await AccountModel.findById(id).orFail().lean().exec();
  console.log("pojo", pojo, pojo._id.toString() === id);
  // deserialize Plain Old Javascript Object into an instance of the Account class
  // serialize Account instance back to a Plain Old Javascript Object, applying class-transformer's magic
  const serialized = classToPlain(plainToClass(Account, pojo));
  console.log("ctp", serialized, serialized._id === id);
  // the reason for doing a transformation round-trip here
  // is that class-transformer can only works it magic on an instance of a class with its annotation
  console.log(serialized === {
    _id: id,
    __v: 0,
    email: "somebody@gmail.com",
  });

  await mongoose.disconnect();
})();
