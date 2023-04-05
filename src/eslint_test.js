// file a
const t = 'hello';
export default t;

// file b
const t = 'something else';

// file c
const fileA = require('a');
const fileB = require('b');

const t = pkg.someFunction();
t.someOtherFunction();
// can also be written
const t = pkg.someFunction().someOtherFunction();
