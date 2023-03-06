// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import * as mongoose from 'mongoose'; // mongoose@7.0.0

interface ISpeciesSchema {
  flows: [IFlowSchema];
  price: number;
}

// SPECIES SCHEMA SETUP
const speciesSchema = new mongoose.Schema<ISpeciesSchema>({
  flows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flow',
    },
  ],
  price: Number,
});

const Species = mongoose.model('Species', speciesSchema);
// type SpeciesDocument = ReturnType<(typeof Species)['hydrate']>;

interface IFlowSchema {
  name: string;
  type: string;
  source: string;
  species: [ISpeciesSchema];
}

// FLOW SCHEMA SETUP
const flowSchema = new mongoose.Schema<IFlowSchema>({
  name: String,
  type: String,
  source: String,
  species: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Species',
    },
  ],
});

const Flow = mongoose.model('Flow', flowSchema);
// type FlowDocument = ReturnType<(typeof Flow)['hydrate']>;

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const species = await Species.find();

  console.log('species[0].id', species[0].id);
  console.log('species[0].flows[0].id', species[0].flows[0].id); // Property 'id' does not exist on type 'IFlowSchema'.ts(2339)

  await mongoose.disconnect();
})();
