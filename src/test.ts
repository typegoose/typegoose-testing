/* eslint-disable @typescript-eslint/no-unused-vars */
// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import { getModelForClass, index, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@13.0.0
import * as mongoose from 'mongoose'; // mongoose@9.0.2

interface FastifyRequest {
  session?: Omit<mongoose.Require_id<Session>, 'user'> & {
    user: mongoose.Require_id<User> & { role: Role };
  };
}

class Role {
  @prop()
  public dummy?: string;
}

const RoleModel = getModelForClass(Role);

class UserStats {
  @prop()
  public dummy?: string;
}

class User {
  @prop({ type: () => String, required: true, unique: true })
  public username!: string;

  @prop({ type: () => String, unique: true })
  public email?: string;

  @prop({ type: () => Boolean, default: false })
  public emailVerified?: boolean;

  @prop({ type: () => String, select: false })
  public passwordHash?: string;

  @prop({ type: () => String })
  public nickname?: string;

  @prop({ type: () => String, required: true })
  public avatar!: string;

  @prop({ ref: () => Role, type: () => String, default: 'user' })
  public role!: Ref<Role, string>;

  // @prop({ type: () => Number, default: 0 })
  // public level!: number;

  // @prop({ type: () => Number, default: 0 })
  // public xp!: number;

  // @prop({ type: () => UserWallet, _id: false, default: {} })
  // public wallet!: UserWallet;

  @prop({ type: () => UserStats, _id: false, default: {} })
  public stats!: UserStats;

  // @prop({ type: () => UserSettings, _id: false, default: {} })
  // public settings!: UserSettings;

  // @prop({ type: () => UserFairness, _id: false, default: {} })
  // public fairness!: UserFairness;

  // @prop({ type: () => UserLinkedDiscord, _id: false, default: null })
  // public linkedDiscord!: UserLinkedDiscord;

  // @prop({ ref: () => AffiliateCode, type: () => String, default: null })
  // public affiliatedBy?: Ref<AffiliateCode>;

  @prop({ type: () => Date, default: Date.now })
  public joined!: Date;

  @prop({ type: () => Date, default: Date.now })
  public lastActive!: Date;
}

const UserModel = getModelForClass(User);

@index({ user: 1 })
@index({ token: 1 })
class Session {
  @prop({ ref: () => 'User', required: true })
  public user!: Ref<User>;

  // @prop({ type: () => String, required: true, default: () => crypto.randomBytes(22).toString('hex') })
  // public token!: string;

  @prop({ type: () => String })
  public country!: string;

  @prop({ type: () => String })
  public ip!: string;

  @prop({ type: () => Date, default: Date.now })
  public lastActive!: Date;
}

const SessionModel = getModelForClass(Session);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const req: FastifyRequest = {};

  const session = await SessionModel.findOne({})
    .populate<{ user: mongoose.Require_id<User> & { role: Role } }>({ path: 'user', populate: { path: 'role' } })
    .lean()
    .exec();

  if (!session?.user) {
    return;
  }

  req.session = session;

  await mongoose.disconnect();
}

main();
