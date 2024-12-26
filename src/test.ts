// NodeJS: 22.8.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { DocumentType, getModelForClass, modelOptions, pre, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.10.1
import * as mongoose from 'mongoose'; // mongoose@8.9.1

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
  },
})
// Add a default condition to filter out soft-deleted documents
@pre<BaseEntity>(
  ['find', 'findOne', 'countDocuments'],
  function () {
    this; // mongoose.Query<DocumentType<BaseEntity>, DocumentType<BaseEntity>, {}, unknown, "find", Record<string, never>>

    // With the line below, the middleware respects queries where the deleted ones are required
    // this.setQuery({ deleted: { $ne: true }, ...this.getQuery() });
    if (this.getOptions().includeDeleted) {
      return;
    }

    // Get the current query
    const currentQuery = this.getQuery();

    // Check if 'deleted' field is already part of the query and is not undefined
    if (currentQuery.hasOwnProperty('deleted') && currentQuery.deleted !== undefined) {
      // If 'deleted' is already defined, do not modify it
      return;
    }

    // With this one, it just extends the query and overrides any possible way to fetch the deleted ones
    this.where({ deleted: { $ne: true } });
  },
  { document: false }
)
export class BaseEntity {
  readonly _id!: mongoose.Types.ObjectId;

  readonly id!: string;

  @prop()
  public createdAt?: Date;

  @prop()
  public updatedAt?: Date;

  @prop()
  public deleted?: boolean;

  @prop()
  public deletedAt?: Date;

  async markDeleted(this: DocumentType<BaseEntity>) {
    this.deleted = true;
    this.deletedAt = new Date();
    await this.save();
  }
}

const UserModel = getModelForClass(BaseEntity);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = new UserModel({ username: 'user1' });

  console.log(doc);

  await mongoose.disconnect();
}

main();
