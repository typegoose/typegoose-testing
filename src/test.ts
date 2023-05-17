// NodeJS: 19.9.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
// import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@11.1.0
import * as mongoose from 'mongoose'; // mongoose@7.1.1

const bookSchema = new mongoose.Schema(
  { name: String },
  {
    collection: 'books',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const BookModel = mongoose.model('Book', bookSchema);

const nestedNestedSchema = new mongoose.Schema(
  {
    bookId: mongoose.Schema.Types.ObjectId,
  },
  {
    virtuals: {
      book: {
        options: {
          localField: 'bookId',
          foreignField: '_id',
          ref: 'Book',
          justOne: true,
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const nestedSchema = new mongoose.Schema(
  {
    a: Number,
    bookId: mongoose.Schema.Types.ObjectId,

    nestedNested: [nestedNestedSchema],
  },
  {
    virtuals: {
      book: {
        options: { localField: 'bookId', foreignField: '_id', justOne: true, ref: 'Book' },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const teacherSchema = new mongoose.Schema(
  {
    bookIds: [mongoose.Schema.Types.ObjectId],

    nested: nestedSchema,
  },
  {
    virtuals: {
      books: {
        options: { localField: 'bookIds', foreignField: '_id', ref: 'Book' },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const TeacherModel = mongoose.model('Teacher', teacherSchema);

// class Book {
//   @prop({ required: true })
//   name!: string;
// }

// @modelOptions({ schemaOptions: { toJSON: { virtuals: true }, toObject: { virtuals: true } } })
// class NestedNested {
//   @prop()
//   bookId?: mongoose.Schema.Types.ObjectId;

//   @prop({
//     localField: 'bookId',
//     foreignField: '_id',
//     justOne: true,
//     ref: () => Book,
//   })
//   readonly book?: Ref<Book>;
// }

// @modelOptions({ schemaOptions: { toJSON: { virtuals: true }, toObject: { virtuals: true } } })
// class Nested {
//   @prop()
//   a?: number;

//   @prop()
//   bookId?: mongoose.Schema.Types.ObjectId;

//   @prop({
//     localField: 'bookId',
//     foreignField: '_id',
//     justOne: true,
//     ref: () => Book,
//   })
//   readonly book?: Ref<Book>;

//   @prop({ type: () => [NestedNested] })
//   nestedNested?: NestedNested[];
// }

// class Teacher {
//   @prop({ type: () => [mongoose.Schema.Types.ObjectId] })
//   bookIds?: mongoose.Schema.Types.ObjectId[];

//   @prop({
//     localField: 'bookIds',
//     foreignField: '_id',
//     ref: () => Book,
//   })
//   readonly books?: Ref<Book>[];

//   @prop({ type: Nested })
//   nested?: Nested;
// }

// const BookModel = getModelForClass(Book, {
//   schemaOptions: {
//     collection: 'books',
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
// });

// const TeacherModel = getModelForClass(Teacher, {
//   schemaOptions: {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
// });

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
    bookIds: [book1._id, book2._id],
    nested: {
      a: 1000,
      bookId: book1._id,
      nestedNested: [
        {
          bookId: book1._id,
        },
        {
          bookId: book2._id,
        },
      ],
    },
  });

  const qTeacher = await TeacherModel.findById(teacher._id)
    .populate('books')
    .populate('nested.book')
    .populate('nested.nestedNested.book')
    .exec();

  console.log('qTeacher?.nested?.nestedNested', qTeacher?.nested?.nestedNested);
  const toObjectTeacher = qTeacher?.toObject({ virtuals: true });
  console.log('toObjectTeacher?.nested?.nestedNested', toObjectTeacher?.nested?.nestedNested);

  await mongoose.disconnect();
}

main();
