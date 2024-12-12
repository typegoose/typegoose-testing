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

  constructor(anatomy: Partial<TokenPojo> = {}) {}

  hash?(this: DocumentType<TokenPojo>) {
    return this._id === undefined ? '' : this._id;
  }
}

const TokenPojoModel = getModelForClass(TokenPojo);

class EncipheredTokensPojo {
  @prop({ ref: () => TokenPojo })
  public accessToken?: Ref<TokenPojo>;

  @prop({ ref: () => TokenPojo })
  public refreshToken?: Ref<TokenPojo>;

  constructor(anatomy: Partial<EncipheredTokensPojo> = {}) {}

  hash?(this: DocumentType<TokenPojo>) {
    return this._id === undefined ? '' : this._id;
  }
}

export const EncipheredTokensPojoModel = getModelForClass(EncipheredTokensPojo);

class UserPojo {
  @prop({ ref: () => EncipheredTokensPojo })
  public tokens?: Ref<EncipheredTokensPojo>;

  constructor(anatomy: Partial<UserPojo> = {}) {}

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

  const accessToken = new TokenPojoModel({
    token: 'dummy token',
    expiresAt,
  });

  const refreshToken = new TokenPojoModel({
    token: 'dummy token',
    expiresAt,
  });

  await Promise.all([accessToken.save(), refreshToken.save()]);

  const user = new UserPojoModel({
    tokens: new EncipheredTokensPojoModel({
      accessToken: accessToken,
      refreshToken: refreshToken,
    }),
  });

  await (user.tokens as DocumentType<EncipheredTokensPojo>).save();
  await user.save();

  await mongoose.disconnect();
}

main();
