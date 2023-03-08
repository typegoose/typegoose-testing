// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@10.2.0
import * as mongoose from 'mongoose'; // mongoose@6.10.0

@modelOptions({
  schemaOptions: {
    discriminatorKey: 'type',
    _id: false,
  },
})
class BodyBase {
  @prop({ required: true })
  type!: string;
}

class BodyText extends BodyBase {
  @prop({ required: true })
  type!: 'text';

  @prop({ required: true })
  text!: string;
}

class BodyFile extends BodyBase {
  @prop({ required: true })
  type!: 'file';

  @prop({ ref: () => File, required: true })
  file!: Ref<File>;
}

class Message {
  @prop({
    type: () => BodyBase,
    discriminators: () => [
      { type: BodyFile, value: 'file' },
      { type: BodyText, value: 'text' },
    ],
  })
  body?: BodyFile | BodyText;
}

// file.entity.ts
class File {
  @prop({
    ref: () => Message,
    localField: '_id',
    foreignField: 'body.file',
    justOne: true,
  })
  message?: Ref<Message>;
}

const MessageModel = getModelForClass(Message);
const FileModel = getModelForClass(File);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  mongoose.set('debug', true);
  mongoose.set('strictQuery', false);

  const fileDoc = await FileModel.create({});

  const messageTextDoc = await MessageModel.create({ body: { type: 'text', text: 'hello' } });
  const messageFileDoc = await MessageModel.create({ body: { type: 'file', file: fileDoc._id } });

  const foundFile = await FileModel.findOne(fileDoc._id).orFail();

  await foundFile.populate('message');

  console.log('found', foundFile.toObject({ virtuals: true }));

  await mongoose.disconnect();
})();
