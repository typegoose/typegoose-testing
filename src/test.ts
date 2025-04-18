// NodeJS: 23.4.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.14.0
import * as mongoose from 'mongoose'; // mongoose@8.13.2

class UserPojo {
  @prop({ type: String })
  emailAddress?: string[];

  @prop({ type: String })
  password?: string[];

  @prop()
  fileNmae?: string;

  @prop()
  size?: number;

  @prop()
  lastModifiedDate?: Date;

  @prop()
  content?: string;

  @prop()
  contentType?: string;
}

const UserPojoModel = getModelForClass(UserPojo);

// @plugin(autopopulate as any) // this is a dirty fix, because the types of this plugin don't work with "esModuleInterop: false"
@modelOptions({
  schemaOptions: { collection: 'appstate', discriminatorKey: '_id' },
  options: { automaticName: true },
})
class AppStatePojo {
  @prop()
  loaded?: boolean;

  @prop({ ref: () => UserPojo, autopopulate: true, unique: true, autoIndex: true, useCreateIndex: true })
  subject?: Ref<UserPojo> | UserPojo;
}

const AppStatePojoModel = getModelForClass(AppStatePojo);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  // first run to create
  const subjectPojo = {
    emailAddress: ['app_statebea569a1-24e0-45fc-8970-f967c77dce83@signs.com'],
    password: ['app_state@signs.com'],
    fileName: 'public/avatar.png',
    size: 8000,
    lastModifiedDate: new Date('2025-04-16T06:33:50.613Z'),
    content: 'data:image/png;base64,SomeLongBase64',
    contentType: 'image/png',
  };
  // this has to be created first as mongoose does not auto-create a reference and would error with "ValidationError: AppStatePojo_appstate validation failed: subject: Cast to ObjectId failed for value ... (type Object) at path "subject" because of "BSONError""
  const subject = await UserPojoModel.create(subjectPojo);
  const createdDoc = await AppStatePojoModel.create({
    loaded: true,
    subject,
  });

  console.log('created:', createdDoc);

  // second run to verify

  const allFound = await AppStatePojoModel.find().populate('subject').exec();

  console.log('allFound:', allFound);

  await mongoose.disconnect();
}

main();
