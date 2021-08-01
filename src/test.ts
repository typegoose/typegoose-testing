// NodeJS: 16.6.0
// MongoDB: 4.2-bionic (Docker)
// import { getModelForClass, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@8.0.1
// import { AnyParamConstructor, BeAnObject, DocumentType, ModelType, ReturnModelType } from "@typegoose/typegoose/lib/types";
import * as mongoose from "mongoose"; // mongoose@5.13.5

// when the "AnyKeys" in mongoose is replaced with this, it works
// type AnyKeys<T> = { [P in keyof T]?: T[P] | any };

// original typegoose issue, cut from the mongoose issue
// class User {
//   @prop()
//   public _id?: string;

//   @prop()
//   public test?: string;

//   public static async ensure<U extends typeof User>(
//     this: ModelType<InstanceType<U>>,
//   ): Promise<mongoose.EnforceDocument<DocumentType<InstanceType<U>>, BeAnObject>> {
//     const _id = "hello";
//     const test = "hello too";
//     await this.create({ test });

//     const t: AnyKeys<InstanceType<U>> = { test };
//     return new this({ test });
//   }
// }
// const UserModel = getModelForClass(User);

class Testy {
  public prop1!: string;
  public prop2?: string;
}

// the following 2 functions should be the same in types, so they both have the error
function test1<U extends typeof Testy>(arg1: mongoose.Model<mongoose.Document & InstanceType<U>>) {
  const t = new arg1({ prop2: "hello" }); // error here
}
function test2<U extends Testy>(arg1: mongoose.Model<mongoose.Document & U>) {
  const t = new arg1({ prop2: "hello" }); // error here
}

// working, both of these blocks should be equal in types
const sch = new mongoose.Schema({ prop1: String, prop2: String });
sch.loadClass(Testy);
{
  const model: mongoose.Model<mongoose.Document<any, any> & InstanceType<typeof Testy>> = mongoose.model("testy1", sch);

  const t = new model({ prop2: "hello" });
}
{
  const model: mongoose.Model<mongoose.Document<any, any> & Testy> = mongoose.model("testy2", sch);

  const t = new model({ prop2: "hello" });
}
