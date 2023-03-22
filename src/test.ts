// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@10.3.2
import assert = require('assert');
import * as mongoose from 'mongoose'; // mongoose@6.10.1

mongoose.set('strictQuery', false); // disable warning

const buildingSchema = new mongoose.Schema(
  {
    width: {
      type: Number,
      default: 100,
    },
    type: {
      type: String,
      enum: ['G', 'S'],
    },
  },
  { discriminatorKey: 'type', _id: false }
);

const garageSchema = buildingSchema.clone();
garageSchema.add({
  slotsForCars: {
    type: Number,
    default: 10,
  },
});

const summerSchema = buildingSchema.clone();
summerSchema.add({
  distanceToLake: {
    type: Number,
    default: 100,
  },
});

const areaSchema = new mongoose.Schema({
  buildings: {
    // 2 dimensonal array
    type: [
      [
        {
          type: buildingSchema,
        },
      ],
    ],
    // // 1 dimensonal array
    // type: [
    //   {
    //     type: buildingSchema,
    //   },
    // ],
  },
});

garageSchema.paths['type'].options.$skipDiscriminatorCheck = true;
summerSchema.paths['type'].options.$skipDiscriminatorCheck = true;
const path: any = areaSchema.path('buildings');

// the following only works with one level of array
path.discriminator('Garage', garageSchema, 'G');
path.discriminator('Summer', summerSchema, 'S');

// // the following works with both one level of array and multiple
// path.discriminator('G', garageSchema, 'G');
// path.discriminator('S', summerSchema, 'S');

const AreaModel = mongoose.model('Area', areaSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  // 2 dimensonal array
  {
    const area: mongoose.Document & Record<string, any> = await AreaModel.create({
      buildings: [
        [
          // the following does not work with multi-dimensonal arrays
          { type: 'S', distanceToLake: 100 },
          { type: 'G', slotsForCars: 20 },
          // // thought the following works with multi-dimensonal arrays
          // { type: 'Summer', distanceToLake: 100 },
          // { type: 'Garage', slotsForCars: 20 },
        ],
      ],
    });

    console.log('level 2 array:', area.buildings[0]);

    assert.ok(area.buildings[0][0].distanceToLake);
    assert.ok(area.buildings[0][1].slotsForCars);
  }

  // // 1 dimensonal array
  // {
  //   const area: mongoose.Document & Record<string, any> = await AreaModel.create({
  //     buildings: [
  //       { type: 'S', distanceToLake: 100 },
  //       { type: 'G', slotsForCars: 20 },
  //     ],
  //   });

  //   console.log('level 1 array:', area.buildings);

  //   assert.ok(area.buildings[0].distanceToLake);
  //   assert.ok(area.buildings[1].slotsForCars);
  // }

  await mongoose.disconnect();
})();
