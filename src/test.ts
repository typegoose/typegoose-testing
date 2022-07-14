// NodeJS: 18.5.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.4
import * as mongoose from 'mongoose'; // mongoose@6.4.4

function assertion(cond: any): asserts cond {
  if (!cond) {
    throw new Error('Expected Assertion to work');
  }
}

// this is a calss, because i forgot how to define getters without it
class Test {
  public get someVirt() {
    return `virtual out`;
  }
}

const NestedSchema = new mongoose.Schema(
  {
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v: mongoose.Schema.Types.Decimal128) => v.toString(),
    },
    otherPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v: mongoose.Schema.Types.Decimal128) => v.toString(),
    },
  },
  {
    toJSON: { getters: true, virtuals: true },
  }
);
NestedSchema.loadClass(Test);

const TopSchema = new mongoose.Schema({
  nestProp: {
    // type: NestedSchema,
    type: [NestedSchema],
  },
});

const TopModel = mongoose.model('Top', TopSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const createdDoc = await TopModel.create({
    // nestProp: {
    //   price: 10.01,
    //   otherPrice: 11.01,
    // },
    nestProp: [
      {
        price: 10.01,
        otherPrice: 11.01,
      },
    ],
  });

  const converted = createdDoc.toJSON();
  console.log(converted);

  // assertion(typeof converted.nestProp === 'object');
  // assertion(typeof (converted.nestProp as any).someVirt === 'string');
  // assertion(typeof converted.nestProp.price === 'string'); // current does not work
  // assertion(typeof converted.nestProp.otherPrice === 'string'); // current does not work

  // the following only when the types are made a array

  const inner = converted!.nestProp[0];

  assertion(typeof inner === 'object');
  assertion(typeof (inner as any).someVirt === 'string');
  assertion(typeof inner.price === 'string'); // works
  assertion(typeof inner.otherPrice === 'string'); // works

  await mongoose.disconnect();
})();
