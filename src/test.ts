// NodeJS: 18.8.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.3
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.12.0
import * as mongoose from 'mongoose'; // mongoose@6.6.1

function globalHook() {}

function globalPlugin(schema: any) {
  console.log('PLUGIN');
  // schema.pre('save', globalHook);
  schema.pre('save', function nonGlobalHook() {});
}

const baseSchema = new mongoose.Schema({});
baseSchema.plugin(globalPlugin);

const BaseModel = mongoose.model('Base', baseSchema);

const disSchema = new mongoose.Schema({});
disSchema.plugin(globalPlugin);

const DisModel = BaseModel.discriminator('Dis', disSchema);

console.log('TEST1', (BaseModel.schema as any).s.hooks._pres.get('save')); // only has 1 "nonGlobalHook"
console.log('TEST2', (DisModel.schema as any).s.hooks._pres.get('save')); // has 2 "nonGlobalHook"
