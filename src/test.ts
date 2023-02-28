// NodeJS: 19.6.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import * as mongoose from 'mongoose'; // mongoose@7.0.0

interface UserProps {
  prop1: string;
  prop2: number;
}

interface UserFn {
  fn1(): string;
}

const schema = new mongoose.Schema({ prop1: String, prop2: String });
schema.method('fn1', () => 'hello');

// eslint-disable-next-line @typescript-eslint/ban-types
type BeAObject = {}; // results in all correct properties and suggestions
// type BeAObject = Record<string, any>; // results in all properties being "any" and not existing as suggestions
// type BeAObject = Record<string, unknown>; // results in all properties being "unknown" and not existing as suggestions
// type BeAObject = Record<string, never>; // results in all properties being "never" and not existing as suggestions

type UserModelType = mongoose.Model<UserProps, BeAObject, UserFn, BeAObject>;
// type UserModelType = mongoose.Model<UserProps, BeAObject, BeAObject, BeAObject>;

const UserModel = mongoose.model(/* <UserProps, UserModelType> */ 'User', schema) as any as UserModelType;

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  // from Record<string, any>:
  // const doc: mongoose.Document<unknown, BeAObject, UserProps> & Omit<UserProps & {
  //   _id: mongoose.Types.ObjectId;
  // }, string> & BeAObject & UserFn
  // from {}:
  // const doc: mongoose.Document<unknown, BeAObject, UserProps> & Omit<UserProps & {
  //   _id: mongoose.Types.ObjectId;
  // }, "fn1"> & UserFn
  const doc = await UserModel.create({});

  doc.fn1(); // exists
  doc.prop1; // not existing in anything other than "{}"
  doc.prop2; // not existing in anything other than "{}"

  // from Record<string, any>:
  // const hdoc1: mongoose.Document<unknown, {}, UserProps> & Omit<UserProps & {
  //   _id: mongoose.Types.ObjectId;
  // }, never>
  const hdoc1: mongoose.HydratedDocument<UserProps> = undefined as any;

  hdoc1.fn1(); // not existing in anything other than "{}"
  hdoc1.prop1; // exists
  hdoc1.prop2; // exists

  // from Record<string, any>:
  // const hdoc2: mongoose.Document<unknown, {}, UserProps> & Omit<UserProps & {
  //   _id: mongoose.Types.ObjectId;
  // }, "fn1"> & UserFn
  const hdoc2: mongoose.HydratedDocument<UserProps, UserFn> = undefined as any;

  hdoc2.fn1(); // exists
  hdoc2.prop1; // exists
  hdoc2.prop2; // exists

  await mongoose.disconnect();
})();
