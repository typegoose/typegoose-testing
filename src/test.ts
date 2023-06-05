/* eslint-disable @typescript-eslint/ban-types */
// NodeJS: 19.9.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@11.2.0
import * as mongoose from 'mongoose'; // mongoose@7.2.2

export function isRefTypeArray<T, S extends mongoose.RefType>(
  docs: mongoose.Types.Array<mongoose.PopulatedDoc<T, S>> | null | undefined
  // error on the next line
): docs is mongoose.Types.Array<S> {
  return Array.isArray(docs) && docs.every((v) => /* some testing func */ true);
}
