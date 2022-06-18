// NodeJS: 18.3.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.2
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.9.0
import * as mongoose from 'mongoose'; // mongoose@6.3.5
import Forms1Model from './models/form1.model';
import { addToForm } from './page3a.server';

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'discordCanaryGrapher',
  });

  const initdoc = await Forms1Model.create({ user: 'someuser', isComplete: false });

  await addToForm('someuser', initdoc._id.toString(), {
    drugDetails: { dateStarted: 'somedate', nameOfDrug: 'named', identifier: 0 },
  });

  await mongoose.disconnect();
})();
