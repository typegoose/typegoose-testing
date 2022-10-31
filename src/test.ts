// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.4
import * as mongoose from 'mongoose'; // mongoose@6.6.5

const Schema = mongoose.Schema;

const clientSchema = new Schema(
  /* <IClient> */ {
    displayName: {
      type: String,
      required: true,
    },
    domains: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Domain',
      },
    ],
  }
);

const domainSchema = new Schema(
  /* <IDomain> */ {
    // identifier: {
    //   type: String,
    //   required: true,
    //   index: true,
    //   unique: true,
    // },
    // plan: domainPlanSchema,
    description: {
      type: String,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
  }
);

const Client = mongoose.model(/* <IClient> */ 'Client', clientSchema, 'clients');
const Domain = mongoose.model(/* <IDomain> */ 'Domain', domainSchema, 'domains');

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  // create initial documents
  const c1 = await Client.create({ displayName: 'test1' });
  const c2 = await Client.create({ displayName: 'test2' });
  const d1 = await Domain.create({ description: 'test1', owner: c1 });
  const d2 = await Domain.create({ description: 'test2', owner: c2 });
  // modify existing documents to have the domains in the array
  await (c1.domains as any).push(d1._id);
  await (c2.domains as any).push(d2._id);
  await c1.save();
  await c2.save();

  // actual find and populate
  const foundDomain = await Domain.findById(d2).populate('owner');
  const foundClient = await Client.findById(c1).populate('domains');

  console.log('foundDomain', foundDomain);
  console.log('foundClient', foundClient);

  await mongoose.disconnect();
})();
