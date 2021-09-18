// NodeJS: 16.9.1
// MongoDB: 4.2-bionic (Docker)
import * as mongoose from 'mongoose'; // mongoose@6.0.6

const sch = new mongoose.Schema({
  something: [{ type: { somePath: String } }],
});
