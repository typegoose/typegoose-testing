// NodeJS: 18.8.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.4
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.12.1
import * as mongoose from 'mongoose'; // mongoose@6.6.4

export const DOCUMENT_NAME = 'LoginLog';
export const COLLECTION_NAME = 'loginLog';

export interface ILoginLog extends mongoose.Document {
  IP: string;
  attemptTimes: number;
  attemptAccounts: string[];
  bannedTimestamp: number;
  banned: boolean;
  deleted: boolean;
  deletedTimestamp: number;
  deletedAccount: string;
  adminManuallyDeleteName: string;
  adminManuallyDeleted: boolean;
  adminManuallyDeleteTimestamp: number;
}
const schema = new mongoose.Schema<ILoginLog>(
  {
    attemptTimes: { type: Number, required: true },
    IP: { type: String, required: true, index: true, unique: true },
    attemptAccounts: { type: [String], required: true },
    bannedTimestamp: { type: Number, required: true },
    deleted: { type: Boolean, required: true },
    deletedTimestamp: { type: Number, required: true },
    deletedAccount: { type: String, required: true },
    adminManuallyDeleteName: { type: String, required: true },
    adminManuallyDeleted: { type: Boolean, required: true },
    adminManuallyDeleteTimestamp: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const loginLog = mongoose.model<ILoginLog>(DOCUMENT_NAME, schema, COLLECTION_NAME);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const t = await loginLog.findOne({ IP: '0.0.0.0' }).select('banned -_id').lean<{ banned: boolean }>().exec();

  await mongoose.disconnect();
})();

function test(): Promise<ILoginLog> {
  // the following will error with "incorrect return type"
  return loginLog.findOne({ IP: '0.0.0.0' }).select('banned -_id').lean<{ banned: boolean }>().exec();
}
