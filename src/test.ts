// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import { getModelForClass, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@13.0.0
import * as mongoose from 'mongoose'; // mongoose@9.0.2

class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;
}

const UserModel = getModelForClass(User);

class Campaign {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;
}

const CampaignModel = getModelForClass(Campaign);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  // Create a test user
  const user = await UserModel.create({
    name: 'Test User',
    email: 'test@example.com',
  });
  console.log('Created user:', user._id);

  // Create a test campaign
  const campaign = await CampaignModel.create({
    name: 'Test Campaign',
    user: user._id,
  });
  console.log('Created campaign:', campaign._id);

  // BUG: Filtering with string causes TypeScript error
  const userIdAsString = user._id.toString();

  // TypeScript error: Type 'string' is not assignable to type 'Ref<User>'
  const campaignsByString = await CampaignModel.find({ user: userIdAsString });
  console.log('Campaigns found with string:', campaignsByString.length);

  // BUG: Filtering with ObjectId causes TypeScript error
  const userIdAsObjectId = new mongoose.Types.ObjectId(userIdAsString);

  // TypeScript error: Type 'ObjectId' is not assignable to type 'Ref<User>'
  const campaignsByObjectId = await CampaignModel.find({ user: userIdAsObjectId });
  console.log('Campaigns found with ObjectId:', campaignsByObjectId.length);

  // The same happens here
  const campaignsByRef = await CampaignModel.find({ user: user._id });
  console.log('Campaigns found with Ref:', campaignsByRef.length);

  await mongoose.disconnect();
}

main();
