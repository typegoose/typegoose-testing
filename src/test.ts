// NodeJS: 19.9.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { getDiscriminatorModelForClass, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@11.1.0
import * as mongoose from 'mongoose'; // mongoose@7.1.1

enum USER_TYPES {
  TEACHER = 'teacher',
}

class Book {
  @prop({ required: true })
  name!: string;
}

@modelOptions({
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
class User {
  @prop({ required: true, enum: USER_TYPES })
  type!: USER_TYPES;

  @prop({ required: true })
  firstName!: string;

  // @prop({ required: true })
  // lastName!: string;
}

@modelOptions({ schemaOptions: { toJSON: { virtuals: true }, toObject: { virtuals: true } } })
class Nested {
  @prop()
  a?: number;

  @prop()
  bookId?: mongoose.Schema.Types.ObjectId;

  @prop({
    localField: 'bookId',
    foreignField: '_id',
    justOne: true,
    ref: () => Book,
  })
  readonly book?: Ref<Book>;
}

class Teacher extends User {
  @prop({ required: true })
  salary!: number;

  @prop({ type: () => [mongoose.Schema.Types.ObjectId] })
  bookIds?: mongoose.Schema.Types.ObjectId[];

  @prop({
    localField: 'bookIds',
    foreignField: '_id',
    ref: () => Book,
  })
  readonly books?: Ref<Book>[];

  @prop({ type: Nested })
  nested?: Nested;
}

const BookModel = getModelForClass(Book, {
  schemaOptions: {
    collection: 'books',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
});

const UserModel = getModelForClass(User, {
  schemaOptions: {
    collection: 'users',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
});

const TeacherModel = getDiscriminatorModelForClass(UserModel, Teacher, USER_TYPES.TEACHER, {
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
});

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const book1 = await BookModel.create({
    name: 'book1',
  });
  const book2 = await BookModel.create({
    name: 'book2',
  });

  const teacher = await TeacherModel.create({
    firstName: 'Vasyl',
    // lastName: 'Kh',
    salary: 1000,
    bookIds: [book1._id, book2._id],
    nested: {
      a: 1000,
      bookId: book1._id,
    },
  });

  const qTeacher = await TeacherModel.findOne().populate('books').populate('nested.book').exec();

  console.log('qTeacher', qTeacher);

  await mongoose.disconnect();
}

main();
