/* eslint-disable @typescript-eslint/no-unused-vars */
// NodeJS: 22.8.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { DocumentType } from '@typegoose/typegoose';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@12.9.0
import * as mongoose from 'mongoose'; // mongoose@8.8.0

class TokenPojo {
  @prop()
  public token?: string;

  @prop()
  public expiresAt?: string;

  constructor(anatomy: Partial<TokenPojo> = {}) {
    for (const [key, val] of Object.entries(anatomy)) {
      // @ts-expect-error This is just for quick assignment showcase
      this[key] = val;
    }
  }

  hash?(this: DocumentType<TokenPojo>) {
    return this._id === undefined ? '' : this._id;
  }
}

const TokenPojoModel = getModelForClass(TokenPojo);

class EncipheredTokensPojo {
  @prop({ ref: () => TokenPojo })
  public accessToken?: Ref<TokenPojo> | TokenPojo;

  @prop({ ref: () => TokenPojo })
  public refreshToken?: Ref<TokenPojo> | TokenPojo;

  constructor(anatomy: Partial<EncipheredTokensPojo> = {}) {
    for (const [key, val] of Object.entries(anatomy)) {
      // @ts-expect-error This is just for quick assignment showcase
      this[key] = val;
    }
  }

  hash?(this: DocumentType<TokenPojo>) {
    return this._id === undefined ? '' : this._id;
  }
}

export const EncipheredTokensPojoModel = getModelForClass(EncipheredTokensPojo);

class UserPojo {
  @prop({ ref: () => EncipheredTokensPojo })
  public tokens?: Ref<EncipheredTokensPojo> | EncipheredTokensPojo;

  constructor(anatomy: Partial<UserPojo> = {}) {
    for (const [key, val] of Object.entries(anatomy)) {
      // @ts-expect-error This is just for quick assignment showcase
      this[key] = val;
    }
  }

  hash?(this: DocumentType<TokenPojo>): mongoose.Types.ObjectId | string {
    return this._id === undefined ? '' : this._id;
  }
}

const UserPojoModel = getModelForClass(UserPojo);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const expiresAtInt = Date.now() + 300000; // 5 minutes later
  const expiresAt = new Date(expiresAtInt).toISOString();

  const accessToken = new TokenPojo({
    token: 'dummy token',
    expiresAt,
  });

  const refreshToken = new TokenPojo({
    token: 'dummy token',
    expiresAt,
  });

  const user = new UserPojo({
    tokens: new EncipheredTokensPojo({
      accessToken: accessToken,
      refreshToken: refreshToken,
    }),
  });

  // all classes are now actual class instances, not documents
  console.log('user', user);

  await mongoose.disconnect();
}

main();
