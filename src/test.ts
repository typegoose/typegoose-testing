// NodeJS: 20.2.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import * as mongoose from 'mongoose'; // mongoose@7.3.1

class SomeClass {
  public test!: string;

  public method() {}

  // private testprop!: string;
  private pmethod() {}
}

interface Test {
  class: SomeClass;
}

interface TestPOJO {
  class: Pick<SomeClass, keyof SomeClass>;
}

// function is expected to return a "Test" interface with a instance of "SomeClass" at "class"
function test(): /* Test */ TestPOJO {
  // using undefined just as a placeholder for types
  const t = undefined as any as mongoose.FlattenMaps<Test>;

  t.class.method(); // type does not error, but is incorrect and does not work at runtime in .lean

  return t; // return works without protected or private fields or methods
}
