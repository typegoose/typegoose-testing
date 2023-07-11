// NodeJS: 20.2.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
// import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@11.3.0
import * as mongoose from 'mongoose'; // mongoose@7.3.3

const Types = ['typeWithPropA', 'typeWithPropB'];

const baseSchema = new mongoose.Schema({
  commonProp: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
    enum: Types,
  },
});

const propASchema = baseSchema.clone();
propASchema.add({
  propA: {
    required: true,
    type: String,
  },
});

const propBSchema = baseSchema.clone();
propBSchema.add({
  propB: {
    required: true,
    type: String,
  },
});

const containNestedSchema = new mongoose.Schema({
  containNestedCommonProp: {
    required: true,
    type: String,
  },
  listWithDiscriminators: {
    required: true,
    type: [baseSchema],
  },
});

{
  const path = containNestedSchema.path('listWithDiscriminators');
  (path as any).discriminator(Types[0], propASchema, Types[0]);
  (path as any).discriminator(Types[1], propBSchema, Types[1]);
}

const parentSchema = new mongoose.Schema({
  aRequiredProp: {
    required: true,
    type: String,
  },
  aList: {
    required: true,
    type: [containNestedSchema],
  },
});

const ParentModel = mongoose.model('parent', parentSchema);

// enum Types {
//   TypeWithPropA = 'typeWithPropA',
//   TypeWithPropB = 'typeWithPropB',
// }

// @modelOptions({
//   schemaOptions: {
//     discriminatorKey: 'type',
//   },
// })
// abstract class Base {
//   @prop({ required: true })
//   commonProp!: string;

//   @prop({ enum: Types, required: true, type: String })
//   type!: Types;
// }

// class PropA extends Base {
//   @prop({ required: true })
//   propA!: string;
// }

// class PropB extends Base {
//   @prop({ required: true })
//   propB!: string;
// }

// class ContainNested {
//   @prop({ required: true })
//   containNestedCommonProp!: string;

//   @prop({
//     required: true,
//     type: Base,
//     discriminators: () => [
//       { type: PropA, value: Types.TypeWithPropA },
//       { type: PropB, value: Types.TypeWithPropB },
//     ],
//   })
//   listWithDiscriminators!: Base[];
// }

// class Parent {
//   @prop({ required: true })
//   aRequiredProp!: string;

//   @prop({ required: true, type: () => [ContainNested] })
//   aList!: ContainNested[];
// }

// const ParentModel = getModelForClass(Parent);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  mongoose.set('debug', true);

  await // Inserting a document with an object of type "TypeWithPropA"
  // in the list with discriminators
  ParentModel.create({
    aRequiredProp: 'hello',
    aList: [
      {
        containNestedCommonProp: 'something-common',
        listWithDiscriminators: [
          {
            // type: Types.TypeWithPropA,
            type: Types[0],
            commonProp: 'this is the common prop',
            propA: 'this is propA',
          },
        ],
      },
    ],
  });

  await ParentModel.findOneAndUpdate(
    {
      aRequiredProp: 'hello',
    },
    {
      // aList: {
      //   0: {
      //     listWithDiscriminators: {
      //       0: {
      //         propA: 'hello 123123',
      //       },
      //     },
      //   },
      // },
      'aList.0.listWithDiscriminators.0.propA': 'hello 123123',
      // 'aList.$[].listWithDiscriminators.$[id].propA': 'hello 123123',
    }
    // {
    //   arrayFilters: [
    //     {
    //       // 'id.type': Types.TypeWithPropA,
    //       'id.type': Types[0],
    //     },
    //   ],
    // }
  ).exec();

  await mongoose.disconnect();
}

main();
