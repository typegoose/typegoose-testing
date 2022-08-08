// NodeJS: 18.7.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.4
import * as mongoose from 'mongoose'; // mongoose@6.5.1

const nestedSchema = new mongoose.Schema({
  1: {
    type: Number,
    default: 0,
  },
});

const topSchema = new mongoose.Schema({
  nestedPath1: {
    mapOfSchema: {
      type: Map,
      of: nestedSchema,
    },
  },
});

const topModel = mongoose.model('topModel', topSchema);

const data = {
  nestedPath1: {
    mapOfSchema: {
      // 2022: { 1: 0 }, // this data does not affect the error
    },
  },
};

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'mongooseGh12220',
  });

  await topModel.create(data); // error "RangeError: Maximum call stack size exceeded"

  await mongoose.disconnect();
})();
