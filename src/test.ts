// NodeJS: 25.2.1
// MongoDB: 7.0 (Docker)
// Typescript 5.9.3
import { buildSchema, prop, setGlobalOptions, setLogLevel, Severity } from '@typegoose/typegoose'; // @typegoose/typegoose@13.0.0
import * as mongoose from 'mongoose'; // mongoose@9.0.2

setLogLevel('debug');
setGlobalOptions({ options: { allowMixed: Severity.ERROR } });

class TestOptions {
  @prop({ type: () => mongoose.Schema.Types.Mixed })
  public someMixed?: any;
}

let thrown = false;

try {
  buildSchema(TestOptions);
} catch (e) {
  // expect throw TypeError
  if (!(e instanceof TypeError)) {
    throw new Error(`Expected to throw TypeError, but got: ${e}`);
  }

  thrown = true;
}

if (!thrown) {
  throw new Error(`Expected to throw an error due to Mixed with Severity.ERROR`);
}
