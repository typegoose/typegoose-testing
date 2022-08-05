// NodeJS: 18.6.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.4
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.11.0
import * as mongoose from 'mongoose'; // mongoose@6.5.0

const ModelOne = mongoose.model(
  'One',
  new mongoose.Schema({
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Two',
    },
    dummy1: String,
  })
);

const ModelTwo = mongoose.model(
  'Two',
  new mongoose.Schema({
    parent2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'One',
    },
    dummy2: String,
  })
);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  let headdocid;
  // create initial documents
  {
    const onedoc1 = await ModelOne.create({ dummy1: 'doc1' });
    const twodoc1 = await ModelTwo.create({ parent2: onedoc1, dummy2: 'doc2' });
    const onedoc2 = await ModelOne.create({ parent: twodoc1, dummy1: 'doc3' });

    headdocid = onedoc2._id;
  }

  const testdoc1 = await ModelOne.findById(headdocid).populate('parent').orFail().exec();
  await testdoc1.populate('parent.parent2');

  console.log('testdoc1', testdoc1);
  console.log('testdoc1 expected?', (testdoc1?.parent as any)?.parent2?.dummy1 === 'doc1'); // should log "true"

  const testdoc2 = await ModelOne.findById(headdocid).populate('parent').orFail().exec();
  await testdoc2.populate({
    path: 'parent.parent2',
    model: 'One',
  });

  console.log('testdoc2', testdoc2);
  console.log('testdoc2 expected?', (testdoc2?.parent as any)?.parent2?.dummy1 === 'doc1'); // should log "true"

  await mongoose.disconnect();
})();
