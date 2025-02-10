// NodeJS: 23.4.0
// MongoDB: 7.0 (Docker)
// Typescript 5.3.3
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.11.0
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import * as mongoose from 'mongoose'; // mongoose@8.10.0

const MongoClient = mongoose.mongo.MongoClient;

@modelOptions({
  schemaOptions: { collection: 'app_details' },
})
class AppDetails extends TimeStamps {
  @prop({ required: true, type: String })
  public version!: string;

  @prop({ required: true, type: Number })
  public numberOfBoots!: number;
}

const AppDetailsModel = getModelForClass(AppDetails, {
  // existingConnection: mongoose.connection, // Remove this and it fails on all getModelForClass objects.
});

const MONGO_URI = 'mongodb://localhost:27017/';
const APP_NAME = 'verifyMASTER';

/**
 * Connect to MongoDB using native driver and Mongoose
 */
async function connectDB() {
  try {
    // First connect with native driver
    const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    });

    await client.connect();
    const db = client.db(APP_NAME);

    // Test native connection
    await db.admin().ping();
    console.log('Native MongoDB connection successful');

    // Now connect Mongoose using the existing native connection
    await mongoose.connect(MONGO_URI, {
      dbName: APP_NAME,
      autoCreate: true,
      autoIndex: true,
    });

    console.log('Mongoose connected using native connection');

    // Test database writes
    const appDetails = await AppDetailsModel.findOne();

    if (!appDetails) {
      await AppDetailsModel.create({
        version: '0.0.0',
        numberOfBoots: 1,
      });
    } else {
      await AppDetailsModel.updateOne({ _id: appDetails._id }, { $inc: { numberOfBoots: 1 } });
    }

    console.log('Database writes successful');

    return { client, mongoose };
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

async function main() {
  const { client, mongoose } = await connectDB();

  await mongoose.disconnect();
  await client.close();
}

main();
