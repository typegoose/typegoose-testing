// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import { getModelForClass, prop, PropType } from '@typegoose/typegoose'; // @typegoose/typegoose@13.2.0-beta.1
// import * as mongoose from 'mongoose'; // mongoose@9.2.3

class User {
  @prop({ type: Map, innerOptions: { type: String } }, PropType.MAP)
  public test?: string;
}

// Error:
// /typegoose-testing/node_modules/@typegoose/typegoose/lib/internal/utils.js:438
//         for (const [key, value] of Object.entries(options.innerOptions)) {
//                                          ^
//
// TypeError: Cannot convert undefined or null to object
getModelForClass(User);
