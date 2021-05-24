// NodeJS: 16.1.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose"; // @typegoose/typegoose@8.0.0-beta.5
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import * as mongoose from "mongoose"; // mongoose@5.12.5

class User {
  @prop()
  public dummy?: string;
}

const UserModel = getModelForClass(User);;

@modelOptions({ schemaOptions: { collection: "bookshelfs", validateBeforeSave: false } })
export class BookCase implements Base {
  public _id: mongoose.Types.ObjectId;
  public id: string;

  @prop()
  public address!: string;

  @prop({ ref: () => Book, default: [] })
  public inventory!: Ref<Book>[];

  @prop({ required: true })
  public title!: string;

  @prop()
  public bcz?: string;

  @prop()
  public comment?: string;

  @prop()
  public contact!: string;

  @prop()
  public deactivated?: boolean;

  @prop()
  public deactreason?: string;

  @prop()
  public digital?: boolean;

  @prop()
  public entrytype?: string;

  @prop()
  public homepage?: string;

  @prop()
  public lat!: string;

  @prop()
  public long!: string;

  @prop()
  public open?: string;

  @prop()
  public type?: string;

  @prop()
  public updatedAt!: Date;
}

@modelOptions({ schemaOptions: { collection: "books", timestamps: true, validateBeforeSave: false } })
export class Book implements Base {

  public static createBook(bookDTO: Object): Book {
    const book = new Book();

    Object.keys(bookDTO).forEach(function (key, index) {
      book[key] = bookDTO[key];
    });

    return book;
  }

  public _id: mongoose.Types.ObjectId;
  public id: string;

  @prop({})
  public gbookid!: string;

  @prop({})
  public ISBN!: string;

  @prop({})
  public addedmanual!: boolean;

  @prop({})
  public borrowed!: boolean;

  @prop({})
  public author!: string;

  @prop({})
  public title!: string;

  @prop({ ref: () => User, required: true })
  public donor!: Ref<User>;

  @prop({ ref: () => BookCase, required: true })
  public location!: Ref<BookCase>;

  @prop()
  public createdAt!: Date;

  @prop()
  public thumbnail!: string;

  @prop()
  public updatedAt!: Date;
}

const BookCaseModel = getModelForClass(BookCase);
const BookModel = getModelForClass(Book);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  const user_doc = await UserModel.create({ dummy: "hi" });
  const bookcase_doc = await BookCaseModel.create({ title: "hello", inventory: [] });

  const book_doc1 = await BookModel.create({ location: bookcase_doc, donor: user_doc });
  const book_doc2 = await BookModel.create({ location: bookcase_doc, donor: user_doc });

  bookcase_doc.inventory.push(book_doc1, book_doc2);
  await bookcase_doc.save();

  const bookcase_found = await BookCaseModel.findById(bookcase_doc._id).orFail().exec();
  console.log(bookcase_found.inventory.filter(inv => inv != book_doc1._id));

  await mongoose.disconnect();
})();
